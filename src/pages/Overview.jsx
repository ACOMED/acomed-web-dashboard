import React, { useEffect, useRef, useState } from 'react';
import {
  Chart,
  DoughnutController, ArcElement,
  RadarController, RadialLinearScale, PointElement, LineElement,
  BarController, BarElement, CategoryScale, LinearScale,
  Tooltip, Legend, Filler
} from 'chart.js';

Chart.register(
  DoughnutController, ArcElement,
  RadarController, RadialLinearScale, PointElement, LineElement,
  BarController, BarElement, CategoryScale, LinearScale,
  Tooltip, Legend, Filler
);

import { api } from '../services/api';

function ComplianceGauge({ score = 85 }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) chartRef.current.destroy();
    const ctx = canvasRef.current.getContext('2d');
    chartRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [score, 100 - score],
          backgroundColor: ['#3aad6e', '#e8f0fe'],
          borderWidth: 0,
          circumference: 270,
          rotation: 225,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '78%',
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        animation: { animateRotate: true, duration: 1000 }
      }
    });
    return () => chartRef.current?.destroy();
  }, [score]);

  return (
    <div className="chart-wrap">
      <div className="gauge-ring-wrap">
        <canvas ref={canvasRef} id="complianceGauge"></canvas>
        <div className="gauge-center-text">
          <div className="gauge-pct">{score}%</div>
          <div className="gauge-sub">Target: 90%</div>
        </div>
      </div>
    </div>
  );
}

function MaturityRadar({ scores }) {
  // Use default labels so the "web template" is always drawn even if data is 0
  let labels = ['Safety', 'Hygiene', 'Documentation', 'Training', 'Process'];
  let values = [0, 0, 0, 0, 0];
  
  if (scores && scores.length > 0) {
    labels = scores.map(s => s.subject);
    values = scores.map(s => s.A);
    // A radar chart needs at least 3 points to draw a shape. If backend sends < 3, pad it.
    while (labels.length < 3) {
      labels.push('N/A');
      values.push(0);
    }
  }
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  useEffect(() => {
    if (chartRef.current) chartRef.current.destroy();
    const ctx = canvasRef.current.getContext('2d');
    chartRef.current = new Chart(ctx, {
      type: 'radar',
      data: {
        labels,
        datasets: [{
          label: 'Maturity',
          data: values,
          backgroundColor: 'rgba(74, 111, 165, 0.15)',
          borderColor: '#4a6fa5',
          pointBackgroundColor: '#4a6fa5',
          pointRadius: 4,
          borderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          r: {
            min: 0, max: 100, ticks: { stepSize: 25, font: { size: 9 } },
            pointLabels: { font: { size: 10 }, color: '#5c5d66' },
            grid: { color: '#e2e7ef' },
          }
        }
      }
    });
    return () => chartRef.current?.destroy();
  }, [scores]);

  return (
    <div className="chart-wrap">
      <canvas ref={canvasRef} id="maturityRadar"></canvas>
    </div>
  );
}

function CapaBarChart({ counts }) {
  // If backend doesn't send counts, default to 0 so it accurately reflects the DB
  const open   = counts?.open   || { Critical: 0, Major: 0, Minor: 0 };
  const closed = counts?.closed || { Critical: 0, Major: 0, Minor: 0 };
  const canvasRef = useRef(null);
  const chartRef  = useRef(null);

  useEffect(() => {
    if (chartRef.current) chartRef.current.destroy();
    const ctx = canvasRef.current.getContext('2d');
    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Critical', 'Major', 'Minor'],
        datasets: [
          { label: 'Open',   data: [open.Critical, open.Major, open.Minor],     backgroundColor: '#e05c6e', borderRadius: 4 },
          { label: 'Closed', data: [closed.Critical, closed.Major, closed.Minor], backgroundColor: '#3aad6e', borderRadius: 4 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'top', labels: { font: { size: 10 }, boxWidth: 10 } }
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 10 } } },
          y: { beginAtZero: true, ticks: { font: { size: 10 } }, grid: { color: '#f0f2f7' } }
        }
      }
    });
    return () => chartRef.current?.destroy();
  }, [counts]);

  return (
    <div className="chart-wrap">
      <canvas ref={canvasRef} id="capaChart"></canvas>
    </div>
  );
}

export default function Overview() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.getAnalyticsOverview()
      .then(res => { if (res.success) setData(res.data); })
      .catch(() => {});
  }, []);

  const complianceScore  = data?.complianceScore ?? 0;
  const maturityScores   = data?.radarData       || null;
  const activeAudits     = data?.activeAudits    ?? 0;
  const openCapas        = data?.openCapas       ?? 0;
  const capaCounts       = data?.capaCounts      || null;
  const facilitiesInspected = data?.facilitiesInspected ?? 0;
  const totalFacilities     = data?.totalFacilities     ?? 0;
  return (
    <div className="dashboard">
      <div className="section-head">
        <div>
          <h2 className="section-title">Analytics &amp; Scoring</h2>
          <p className="section-note">Real-time metrics for Compliance and Maturity</p>
        </div>
      </div>

      <div className="card-grid">
        <div className="card card-md">
          <h4>Compliance Score</h4>
          <ComplianceGauge score={complianceScore} />
        </div>
        <div className="card card-md">
          <h4>Maturity Score</h4>
          <MaturityRadar scores={maturityScores} />
        </div>
        <div className="card card-md">
          <h4>CAPA Status</h4>
          <CapaBarChart counts={capaCounts} />
        </div>
      </div>

      <div className="kpi-row">
        <div className="kpi-mini-card">
          <div className="kpi-mini-title">Active Audits</div>
          <div className="kpi-mini-value">{activeAudits}</div>
        </div>
        <div className="kpi-mini-card">
          <div className="kpi-mini-title">Pending CAPAs</div>
          <div className="kpi-mini-value danger">{openCapas}</div>
        </div>
        <div className="kpi-mini-card">
          <div className="kpi-mini-title">Facilities Inspected</div>
          <div className="kpi-mini-value">{facilitiesInspected} <span style={{ fontSize: '14px', color: '#88a8d4', fontWeight: '600' }}>/ {totalFacilities}</span></div>
        </div>
        <div className="kpi-mini-card">
          <div className="kpi-mini-title">System Health</div>
          <div className="kpi-mini-value" style={{ color: '#3aad6e' }}>Good</div>
        </div>
      </div>

      <div className="overview-bottom-grid">
        <div className="card">
          <h4>Recent Activity</h4>
          <div className="feed-list">
            <div style={{ padding: '20px', textAlign: 'center', color: '#88a8d4', fontSize: '13px' }}>
              No recent activity found.
            </div>
          </div>
        </div>

        <div className="card">
          <h4>My Action Items</h4>
          <div className="action-list">
            <div style={{ padding: '20px', textAlign: 'center', color: '#88a8d4', fontSize: '13px' }}>
              You have no pending action items.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
