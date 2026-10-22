import React, { useState, useEffect } from 'react';
import { QrCode, CheckCircle, Clock, ShieldCheck, X, RefreshCw, AlertCircle } from 'lucide-react';

interface TimelineEvent {
  stage: string;
  title: string;
  timestamp: string;
  verified: boolean;
  notes: string;
}

interface TimelineData {
  transactionId: string;
  foodName: string;
  donor: string;
  receiver: string;
  quantity: string;
  currentStatus: string;
  events: TimelineEvent[];
}

interface QrTrackingModalProps {
  transactionId: string;
  onClose: () => void;
}

export const QrTrackingModal: React.FC<QrTrackingModalProps> = ({ transactionId, onClose }) => {
  const [qrData, setQrData] = useState<any>(null);
  const [timeline, setTimeline] = useState<TimelineData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [scanMessage, setScanMessage] = useState<string>('');

  const fetchPayloadAndTimeline = async () => {
    setLoading(true);
    try {
      const qrRes = await fetch(`/api/qr/${transactionId}/payload`);
      const qrJson = await qrRes.json();
      if (qrJson.success) setQrData(qrJson.data);

      const timeRes = await fetch(`/api/qr/${transactionId}/timeline`);
      const timeJson = await timeRes.json();
      if (timeJson.success) setTimeline(timeJson.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayloadAndTimeline();
  }, [transactionId]);

  const handleSimulateScan = async (eventType: 'COLLECTION_SCAN' | 'DELIVERY_SCAN' | 'AUDIT_SCAN') => {
    if (!qrData?.qrPayload) return;
    try {
      const res = await fetch(`/api/qr/${transactionId}/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scannedPayload: qrData.qrPayload,
          eventType,
          actorEmail: 'volunteer@demo.local',
          actorRole: 'VOLUNTEER'
        })
      });
      const json = await res.json();
      if (json.success) {
        setScanMessage(`Scan verified! Advanced status to ${json.data.currentStatus}`);
        fetchPayloadAndTimeline();
        setTimeout(() => setScanMessage(''), 4000);
      } else {
        setScanMessage(`Transition rejected: ${json.message}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">QR Food Tracking & Verification</h3>
              <p className="text-xs text-slate-400">Cryptographically signed handover token</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code Graphic & Details */}
        <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm shrink-0 text-center">
            {/* Visual SVG QR representation */}
            <div className="w-32 h-32 bg-slate-900 text-white flex flex-col items-center justify-center p-2 rounded-xl font-mono text-[9px] break-all leading-tight">
              <QrCode className="w-16 h-16 text-emerald-400 mb-1" />
              <span>SF-TXN://</span>
              <span className="text-[8px] text-slate-400">{transactionId.substring(0, 8)}</span>
            </div>
            <span className="block text-[10px] text-slate-400 font-mono mt-1">Status: {timeline?.currentStatus}</span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600">
            <div>Food Item: <span className="font-bold text-slate-900">{timeline?.foodName}</span></div>
            <div>Donor: <span className="font-semibold text-slate-800">{timeline?.donor}</span></div>
            <div>Receiver: <span className="font-semibold text-slate-800">{timeline?.receiver}</span></div>
            <div>Quantity: <span className="font-bold text-emerald-700">{timeline?.quantity}</span></div>
            <div className="pt-2 text-[10px] text-slate-400 font-mono break-all">
              Payload: {qrData?.qrPayload || 'SF-TXN://' + transactionId}
            </div>
          </div>
        </div>

        {scanMessage && (
          <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            {scanMessage}
          </div>
        )}

        {/* State Machine Scanner Simulation Buttons */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-700">Simulate Mobile Scanner Handover:</div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleSimulateScan('COLLECTION_SCAN')}
              className="py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold text-xs rounded-xl border border-amber-200 transition"
            >
              1. Kitchen Pickup Scan
            </button>
            <button
              onClick={() => handleSimulateScan('DELIVERY_SCAN')}
              className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs rounded-xl border border-emerald-200 transition"
            >
              2. Shelter Delivery Scan
            </button>
            <button
              onClick={() => handleSimulateScan('AUDIT_SCAN')}
              className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition"
            >
              Audit Inspect Scan
            </button>
          </div>
        </div>

        {/* Verified Event Timeline */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-700">Verified Event Timeline:</div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {timeline?.events?.map((ev, i) => (
              <div key={i} className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-800">{ev.title}</div>
                  <div className="text-[11px] text-slate-500">{ev.notes}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
