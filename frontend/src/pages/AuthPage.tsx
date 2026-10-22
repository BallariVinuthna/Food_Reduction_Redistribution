import React, { useState } from 'react';
import { useAuth, DEMO_CREDENTIALS } from '../context/AuthContext';
import { Role } from '../types';
import {
  Leaf,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  Building2,
  MapPin,
  Truck,
  HeartHandshake,
  Package,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
  onSuccess?: () => void;
  onExploreOverview?: () => void;
}

const HYDERABAD_LOCATION_PRESETS = [
  { name: 'Banjara Hills', lat: 17.4156, lng: 78.4357 },
  { name: 'Gachibowli', lat: 17.4401, lng: 78.3489 },
  { name: 'Secunderabad', lat: 17.4399, lng: 78.4983 },
  { name: 'Hitec City', lat: 17.4474, lng: 78.3762 },
  { name: 'Charminar', lat: 17.3616, lng: 78.4747 },
];

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
  onSuccess,
  onExploreOverview,
}) => {
  const { login, register, switchDemoRole, loading } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [selectedRole, setSelectedRole] = useState<Role>('FOOD_PROVIDER');
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regOrgName, setRegOrgName] = useState('');
  const [regOrgType, setRegOrgType] = useState('RESTAURANT');
  const [regAddress, setRegAddress] = useState('Banjara Hills, Hyderabad');
  const [regLat, setRegLat] = useState<number>(17.4156);
  const [regLng, setRegLng] = useState<number>(78.4357);
  const [regCapacity, setRegCapacity] = useState<number>(150);
  const [regVehicleType, setRegVehicleType] = useState('TWO_WHEELER');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    try {
      await login(loginEmail.trim(), loginPassword);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!regFullName.trim()) {
      setErrorMsg('Full name is required.');
      return;
    }
    if (!regEmail.trim()) {
      setErrorMsg('Email address is required.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    const payload: any = {
      fullName: regFullName.trim(),
      email: regEmail.trim(),
      password: regPassword,
      phone: regPhone.trim() || undefined,
      role: selectedRole,
      address: regAddress.trim() || 'Hyderabad, Telangana',
      latitude: regLat,
      longitude: regLng,
    };

    if (selectedRole === 'FOOD_PROVIDER') {
      payload.organizationName = regOrgName.trim() || regFullName.trim();
      payload.organizationType = regOrgType;
    } else if (selectedRole === 'NGO_RECEIVER') {
      payload.organizationName = regOrgName.trim() || regFullName.trim();
      payload.organizationType = regOrgType || 'NGO';
      payload.capacityMeals = Number(regCapacity) || 100;
    } else if (selectedRole === 'VOLUNTEER') {
      payload.vehicleType = regVehicleType;
    }

    try {
      await register(payload);
      setSuccessMsg('Account registered successfully! Redirecting...');
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 500);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Registration failed. Email may already be in use.');
    }
  };

  const handleQuickDemoLogin = async (role: Role) => {
    setErrorMsg(null);
    try {
      await switchDemoRole(role);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Demo login failed');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-950 text-slate-100">
      <div className="w-full max-w-xl">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-lime-400 text-emerald-950 shadow-xl mb-3">
            <Leaf className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            SurplusFlow <span className="text-lime-300">Hyderabad</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md mx-auto">
            Smart Food Waste Reduction & Autonomous Redistribution System
          </p>
        </div>

        {/* Auth Box Container */}
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700/70 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle accent glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-lime-400 to-transparent" />

          {/* Mode Tabs */}
          <div className="flex bg-slate-800/80 rounded-2xl p-1 mb-6 border border-slate-700">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                mode === 'login'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Lock className="w-4 h-4" />
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                mode === 'register'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              Sign Up / Register
            </button>
          </div>

          {/* Status Alerts */}
          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/80 border border-lime-500/50 text-lime-200 text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-lime-400 shrink-0 mt-0.5" />
              <div>{successMsg}</div>
            </div>
          )}

          {/* ==================== LOGIN FORM ==================== */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. provider@demo.local"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-emerald-950 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <span>Sign In to SurplusFlow</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <span className="text-xs text-slate-400">Not registered yet? </span>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMsg(null);
                  }}
                  className="text-xs font-semibold text-lime-400 hover:underline cursor-pointer"
                >
                  Create an account here
                </button>
              </div>

              {/* Quick Demo Autofill/Login Section for Evaluation */}
              <div className="mt-6 pt-5 border-t border-slate-800">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 text-center mb-3">
                  Quick Demo Accounts (1-Click Login)
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('FOOD_PROVIDER')}
                    className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-left transition-all"
                  >
                    <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5" /> Food Provider
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">Taj Banjara</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('NGO_RECEIVER')}
                    className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-left transition-all"
                  >
                    <div className="text-xs font-semibold text-teal-400 flex items-center gap-1.5">
                      <HeartHandshake className="w-3.5 h-3.5" /> NGO Receiver
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">Robin Hood Army</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('VOLUNTEER')}
                    className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-left transition-all"
                  >
                    <div className="text-xs font-semibold text-lime-400 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5" /> Volunteer
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">Vikram Sharma</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('ADMIN')}
                    className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-left transition-all"
                  >
                    <div className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" /> Administrator
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">admin@demo.local</div>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* ==================== REGISTER FORM ==================== */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Select Your Role
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {[
                    { id: 'FOOD_PROVIDER', label: 'Provider', icon: Package, desc: 'Hotels, Cafes' },
                    { id: 'NGO_RECEIVER', label: 'Receiver', icon: HeartHandshake, desc: 'Shelters, NGOs' },
                    { id: 'VOLUNTEER', label: 'Volunteer', icon: Truck, desc: 'Transit Pickup' },
                    { id: 'ADMIN', label: 'Admin', icon: ShieldCheck, desc: 'Analytics' },
                  ].map((r) => {
                    const Icon = r.icon;
                    const isSelected = selectedRole === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setSelectedRole(r.id as Role)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600/30 border-lime-400 text-white shadow-xs'
                            : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-500'
                        }`}
                      >
                        <Icon className={`w-5 h-5 mx-auto mb-1 ${isSelected ? 'text-lime-300' : 'text-slate-400'}`} />
                        <div className="text-xs font-bold leading-tight">{r.label}</div>
                        <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{r.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Common Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="e.g. Ramesh Varma"
                    className="w-full px-3.5 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-lime-400 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-lime-400 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full px-3.5 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-lime-400 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Password (min 6 chars) *
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-lime-400 text-sm"
                  />
                </div>
              </div>

              {/* Role-Specific fields */}
              {(selectedRole === 'FOOD_PROVIDER' || selectedRole === 'NGO_RECEIVER') && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      value={regOrgName}
                      onChange={(e) => setRegOrgName(e.target.value)}
                      placeholder={selectedRole === 'FOOD_PROVIDER' ? 'e.g. Paradise Biryani' : 'e.g. Hope Foundation'}
                      className="w-full px-3.5 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-lime-400 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                      Organization Type
                    </label>
                    <select
                      value={regOrgType}
                      onChange={(e) => setRegOrgType(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-lime-400 text-sm"
                    >
                      {selectedRole === 'FOOD_PROVIDER' ? (
                        <>
                          <option value="RESTAURANT">Restaurant</option>
                          <option value="HOTEL">Hotel</option>
                          <option value="HOSTEL">Hostel</option>
                          <option value="COLLEGE_CANTEEN">College Canteen</option>
                          <option value="SUPERMARKET">Supermarket</option>
                          <option value="MARRIAGE_HALL">Marriage Hall</option>
                          <option value="CATERING">Catering Service</option>
                        </>
                      ) : (
                        <>
                          <option value="NGO">NGO / Non-Profit</option>
                          <option value="SHELTER">Community Shelter</option>
                          <option value="COMMUNITY_KITCHEN">Community Kitchen</option>
                          <option value="ORPHANAGE">Orphanage / Old Age Home</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
              )}

              {selectedRole === 'NGO_RECEIVER' && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Daily Feeding Capacity (Meals)
                  </label>
                  <input
                    type="number"
                    min={10}
                    value={regCapacity}
                    onChange={(e) => setRegCapacity(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-white text-sm"
                  />
                </div>
              )}

              {selectedRole === 'VOLUNTEER' && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Vehicle Type
                  </label>
                  <select
                    value={regVehicleType}
                    onChange={(e) => setRegVehicleType(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-white text-sm"
                  >
                    <option value="TWO_WHEELER">Two-Wheeler (Bike / Scooter)</option>
                    <option value="FOUR_WHEELER">Four-Wheeler (Car / SUV)</option>
                    <option value="AUTO_RICKSHAW">Auto-Rickshaw</option>
                    <option value="MINI_VAN">Mini-Van / Cargo</option>
                  </select>
                </div>
              )}

              {/* Address and Hyderabad Location Presets */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Location / Address in Hyderabad
                  </label>
                  <span className="text-[11px] text-lime-400">Hyderabad Metro Scope</span>
                </div>
                <input
                  type="text"
                  value={regAddress}
                  onChange={(e) => setRegAddress(e.target.value)}
                  placeholder="Street / Area, Hyderabad"
                  className="w-full px-3.5 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm mb-2"
                />

                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className="text-[11px] text-slate-400 mr-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-lime-400" /> Presets:
                  </span>
                  {HYDERABAD_LOCATION_PRESETS.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => {
                        setRegAddress(`${p.name}, Hyderabad`);
                        setRegLat(p.lat);
                        setRegLng(p.lng);
                      }}
                      className={`text-[10px] px-2 py-1 rounded-lg border transition-all ${
                        regAddress.includes(p.name)
                          ? 'bg-lime-400/20 text-lime-300 border-lime-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-lime-500 hover:from-emerald-400 hover:to-lime-400 text-emerald-950 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Registering...</span>
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <span className="text-xs text-slate-400">Already registered? </span>
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg(null);
                  }}
                  className="text-xs font-semibold text-lime-400 hover:underline cursor-pointer"
                >
                  Sign in here
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Public Project Overview Button */}
        {onExploreOverview && (
          <div className="text-center mt-5">
            <button
              type="button"
              onClick={onExploreOverview}
              className="text-xs text-slate-400 hover:text-lime-300 underline underline-offset-4 cursor-pointer transition-colors"
            >
              Browse Public System Overview & Scientific Framework →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
