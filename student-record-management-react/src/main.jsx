import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  GraduationCap, LayoutDashboard, Users, ClipboardCheck, FileText,
  UserRound, LogOut, Plus, Search, Trash2, Upload, CheckCircle2,
  XCircle, CalendarDays, BookOpen, Menu, X, Eye, EyeOff, Download, Send,
  Lock, Mail, KeyRound, ShieldCheck, AlertCircle, RotateCcw,
  ChevronLeft, ChevronRight, UserPlus, LogIn
} from 'lucide-react';
import './styles.css';
import {
  DEMO_CREDENTIALS,
  starterStudents,
  starterAttendance,
  starterAssignments,
  starterSubmissions
} from './demoData';

const seed = (key, defaultValue) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    const parsed = JSON.parse(raw);
    // Upgrade if previously saved student list has fewer than 50 students
    if (key === 'srms_students' && Array.isArray(parsed) && parsed.length < 50) {
      return defaultValue;
    }
    return parsed;
  } catch {
    return defaultValue;
  }
};

const persist = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Storage error:', e);
  }
};

const today = () => new Date().toISOString().slice(0, 10);

function App() {
  const [session, setSession] = useState(() => {
    try {
      const saved = localStorage.getItem('srms_auth_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [role, setRole] = useState(() => session?.role || '');
  const [page, setPage] = useState(() => (session?.role === 'admin' ? 'overview' : 'student-home'));
  const [students, setStudents] = useState(() => seed('srms_students', starterStudents));
  const [attendance, setAttendance] = useState(() => seed('srms_attendance', starterAttendance));
  const [assignments, setAssignments] = useState(() => seed('srms_assignments', starterAssignments));
  const [submissions, setSubmissions] = useState(() => seed('srms_submissions', starterSubmissions));
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState('');
  const [mobileNav, setMobileNav] = useState(false);
  const [studentId, setStudentId] = useState(() => session?.user?.id || 's1');

  useEffect(() => persist('srms_students', students), [students]);
  useEffect(() => persist('srms_attendance', attendance), [attendance]);
  useEffect(() => persist('srms_assignments', assignments), [assignments]);
  useEffect(() => persist('srms_submissions', submissions), [submissions]);

  const notify = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 3000);
  };

  const handleLogin = (userRole, userObj) => {
    const newSession = { role: userRole, user: userObj };
    setSession(newSession);
    setRole(userRole);
    persist('srms_auth_session', newSession);

    if (userRole === 'admin') {
      setPage('overview');
      notify('Signed in as Administrator.');
    } else {
      setStudentId(userObj.id);
      setPage('student-home');
      notify(`Welcome back, ${userObj.name}!`);
    }
  };

  const logout = () => {
    localStorage.removeItem('srms_auth_session');
    setSession(null);
    setRole('');
    setPage('overview');
    setMobileNav(false);
    notify('You have been signed out.');
  };

  const resetAllDemoData = () => {
    if (window.confirm('Reset all demo data back to default 50 students, attendance records, and sample assignments?')) {
      setStudents(starterStudents);
      setAttendance(starterAttendance);
      setAssignments(starterAssignments);
      setSubmissions(starterSubmissions);
      persist('srms_students', starterStudents);
      persist('srms_attendance', starterAttendance);
      persist('srms_assignments', starterAssignments);
      persist('srms_submissions', starterSubmissions);
      notify('Demo data successfully reset to 50 students.');
    }
  };

  const currentStudent = students.find(s => s.id === (role === 'student' ? (session?.user?.id || studentId) : studentId)) || students[0];

  const nav = role === 'admin'
    ? [
        ['overview', 'Overview', LayoutDashboard],
        ['students', 'Students', Users],
        ['attendance', 'Attendance', ClipboardCheck],
        ['assignments', 'Assignments', FileText]
      ]
    : [
        ['student-home', 'My dashboard', LayoutDashboard],
        ['my-attendance', 'My attendance', ClipboardCheck],
        ['my-assignments', 'Assignments', BookOpen]
      ];

  const go = (p) => {
    setPage(p);
    setMobileNav(false);
  };

  if (!role) {
    return (
      <Login
        onLogin={handleLogin}
        students={students}
        setStudents={setStudents}
        studentId={studentId}
        setStudentId={setStudentId}
        notify={notify}
      />
    );
  }

  const currentUserDisplayName = role === 'admin' ? (session?.user?.name || 'Administrator') : (currentStudent?.name || 'Student');
  const currentUserSubtext = role === 'admin' ? 'Admin account' : `Roll no. ${currentStudent?.rollNo || '—'}`;
  const currentUserAvatar = role === 'admin' ? 'A' : (currentStudent?.name?.[0] || 'S');

  return (
    <div className="app-shell">
      {mobileNav && <button className="mobile-scrim" onClick={() => setMobileNav(false)} aria-label="Close menu" />}
      
      <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <span className="brand-mark"><GraduationCap size={23}/></span>
          <span>Campus<span className="brand-light">Desk</span><small>STUDENT RECORDS</small></span>
          <button className="close-nav" onClick={() => setMobileNav(false)}><X/></button>
        </div>
        
        <div className="workspace-label">WORKSPACE</div>
        <nav>
          {nav.map(([id, label, Icon]) => (
            <button
              key={id}
              className={`nav-item ${page === id ? 'active' : ''}`}
              onClick={() => go(id)}
            >
              <Icon size={18}/>
              <span>{label}</span>
            </button>
          ))}
        </nav>
        
        <div className="sidebar-bottom">
          <div className="profile-mini">
            <div className="avatar">{currentUserAvatar}</div>
            <div>
              <strong>{currentUserDisplayName}</strong>
              <small>{currentUserSubtext}</small>
            </div>
          </div>
          <button className="nav-item logout" onClick={logout}>
            <LogOut size={18}/>
            Log out
          </button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="menu-toggle" onClick={() => setMobileNav(true)}><Menu/></button>
          <div className="breadcrumbs">
            Workspace <span>/</span> <strong>{nav.find(n => n[0] === page)?.[1] || 'Dashboard'}</strong>
          </div>
          <div className="topbar-right">
            <span className={`role-pill ${role}`}>
              {role === 'admin' ? 'Admin portal' : 'Student portal'}
            </span>
            <div className="avatar small">{currentUserAvatar}</div>
          </div>
        </header>

        <div className="page-content">
          {role === 'admin' && page === 'overview' && (
            <Overview
              students={students}
              attendance={attendance}
              assignments={assignments}
              go={go}
              onResetDemo={resetAllDemoData}
            />
          )}
          {role === 'admin' && page === 'students' && (
            <Students
              students={students}
              setStudents={setStudents}
              search={search}
              setSearch={setSearch}
              notify={notify}
            />
          )}
          {role === 'admin' && page === 'attendance' && (
            <Attendance
              students={students}
              attendance={attendance}
              setAttendance={setAttendance}
              notify={notify}
            />
          )}
          {role === 'admin' && page === 'assignments' && (
            <AdminAssignments
              assignments={assignments}
              setAssignments={setAssignments}
              submissions={submissions}
              notify={notify}
            />
          )}
          {role === 'student' && page === 'student-home' && (
            <StudentHome
              student={currentStudent}
              attendance={attendance}
              assignments={assignments}
              submissions={submissions}
              go={go}
            />
          )}
          {role === 'student' && page === 'my-attendance' && (
            <StudentAttendance
              student={currentStudent}
              attendance={attendance}
            />
          )}
          {role === 'student' && page === 'my-assignments' && (
            <StudentAssignments
              student={currentStudent}
              assignments={assignments}
              submissions={submissions}
              setSubmissions={setSubmissions}
              notify={notify}
            />
          )}

          <footer>
            CampusDesk <span>•</span> Student Record Management
            <span className="footer-note">
              Demo mode · {students.length} students loaded ·
              {' '}
              <button className="btn-reset" onClick={resetAllDemoData} title="Reset demo data">
                <RotateCcw size={12}/> Reset 50 Students
              </button>
            </span>
          </footer>
        </div>
      </main>

      {notice && (
        <div className="toast">
          <CheckCircle2 size={18}/>
          {notice}
        </div>
      )}
    </div>
  );
}

function Login({ onLogin, students, setStudents, studentId, setStudentId, notify }) {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [selectedRole, setSelectedRole] = useState('admin'); // 'admin' | 'student'
  
  // Login form state
  const [identifier, setIdentifier] = useState('admin@campus.edu');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Register form state (for students)
  const [regForm, setRegForm] = useState({
    name: '',
    rollNo: '',
    className: 'CSE',
    section: 'A',
    batch: '2027',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setErrorMsg('');
    if (role === 'admin') {
      setIdentifier(DEMO_CREDENTIALS.admin.email);
      setPassword(DEMO_CREDENTIALS.admin.password);
    } else {
      const activeStudent = students.find(s => s.id === studentId) || students[0];
      setIdentifier(activeStudent?.rollNo || '101');
      setPassword(DEMO_CREDENTIALS.studentDefaultPassword);
    }
  };

  const handleStudentSelect = (id) => {
    setStudentId(id);
    const chosen = students.find(s => s.id === id);
    if (chosen) {
      setIdentifier(chosen.rollNo);
      setPassword(DEMO_CREDENTIALS.studentDefaultPassword);
      setErrorMsg('');
    }
  };

  const fillQuickDemo = (roleType, ident, pass) => {
    setSelectedRole(roleType);
    setAuthMode('login');
    setIdentifier(ident);
    setPassword(pass);
    setErrorMsg('');
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanIdent = identifier.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanIdent || !cleanPass) {
      setErrorMsg('Please enter both identifier and password.');
      return;
    }

    if (selectedRole === 'admin') {
      const isEmailMatch = cleanIdent === DEMO_CREDENTIALS.admin.email.toLowerCase();
      const isUserMatch = cleanIdent === DEMO_CREDENTIALS.admin.username.toLowerCase();
      const isPassMatch = cleanPass === DEMO_CREDENTIALS.admin.password;

      if ((isEmailMatch || isUserMatch) && isPassMatch) {
        onLogin('admin', DEMO_CREDENTIALS.admin);
      } else {
        setErrorMsg('Invalid admin credentials. Use admin@campus.edu / admin123');
      }
    } else {
      // Student authentication
      const matchedStudent = students.find(s =>
        s.rollNo.toString().toLowerCase() === cleanIdent ||
        (s.email && s.email.toLowerCase() === cleanIdent)
      );

      if (!matchedStudent) {
        setErrorMsg(`No student found matching roll number or email "${identifier}".`);
        return;
      }

      const validPassword = matchedStudent.password || DEMO_CREDENTIALS.studentDefaultPassword;
      // Allow student to sign in with their roll number OR student123 for convenience
      if (cleanPass === validPassword || cleanPass === matchedStudent.rollNo) {
        onLogin('student', matchedStudent);
      } else {
        setErrorMsg('Incorrect password. Default demo password is "student123".');
      }
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (regForm.password !== regForm.confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (students.some(s => s.rollNo.trim().toLowerCase() === regForm.rollNo.trim().toLowerCase())) {
      setErrorMsg(`Roll number "${regForm.rollNo}" already exists.`);
      return;
    }

    const newStudent = {
      id: crypto.randomUUID(),
      name: regForm.name.trim(),
      rollNo: regForm.rollNo.trim(),
      className: regForm.className,
      section: regForm.section,
      batch: regForm.batch || '2027',
      email: regForm.email.trim() || `${regForm.name.toLowerCase().replace(/\s+/g, '.')}@campus.edu`,
      password: regForm.password
    };

    setStudents(prev => [newStudent, ...prev]);
    notify('Student account registered successfully!');
    onLogin('student', newStudent);
  };

  return (
    <div className="login-page">
      <div className="login-art">
        <div className="art-logo"><GraduationCap size={30}/></div>
        <div className="art-copy">
          <span className="eyebrow">YOUR CAMPUS, ORGANIZED</span>
          <h1>Everything students need.<br/><em>All in one place.</em></h1>
          <p>Manage student records, attendance and assignments with a clean, simple workspace.</p>
        </div>
        <div className="art-stats">
          <div><strong>50</strong><span>Student records</span></div>
          <div><strong>02</strong><span>Attendance tracking</span></div>
          <div><strong>03</strong><span>Assignments</span></div>
        </div>
      </div>

      <div className="login-panel">
        <div className="login-form-wrap">
          <div className="mobile-logo"><GraduationCap/> CampusDesk</div>
          
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${authMode === 'login' ? 'selected' : ''}`}
              onClick={() => { setAuthMode('login'); setErrorMsg(''); }}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`auth-tab ${authMode === 'register' ? 'selected' : ''}`}
              onClick={() => { setAuthMode('register'); setErrorMsg(''); }}
            >
              Create Account
            </button>
          </div>

          {authMode === 'login' ? (
            <>
              <span className="eyebrow">AUTHENTICATION</span>
              <h2>Sign in to workspace</h2>
              <p className="muted">Select your portal role and enter your credentials.</p>

              <div className="role-select">
                <button
                  type="button"
                  className={selectedRole === 'admin' ? 'selected' : ''}
                  onClick={() => handleRoleChange('admin')}
                >
                  <Users size={19}/>
                  <span>
                    <strong>Administrator</strong>
                    <small>Manage campus records</small>
                  </span>
                </button>
                <button
                  type="button"
                  className={selectedRole === 'student' ? 'selected' : ''}
                  onClick={() => handleRoleChange('student')}
                >
                  <UserRound size={19}/>
                  <span>
                    <strong>Student</strong>
                    <small>View your academic details</small>
                  </span>
                </button>
              </div>

              {errorMsg && (
                <div className="auth-alert error">
                  <AlertCircle size={16}/>
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit}>
                {selectedRole === 'student' && (
                  <label className="field-label" style={{ marginBottom: '14px' }}>
                    Quick-pick from 50 demo students
                    <select
                      value={studentId}
                      onChange={e => handleStudentSelect(e.target.value)}
                    >
                      {students.slice(0, 50).map(s => (
                        <option key={s.id} value={s.id}>
                          Roll {s.rollNo} · {s.name} ({s.className}-{s.section})
                        </option>
                      ))}
                    </select>
                  </label>
                )}

                <label className="field-label" style={{ marginBottom: '14px' }}>
                  {selectedRole === 'admin' ? 'Admin Email / Username' : 'Roll Number or Student Email'}
                  <div className="input-with-action">
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={e => setIdentifier(e.target.value)}
                      placeholder={selectedRole === 'admin' ? 'admin@campus.edu or admin' : 'e.g. 101 or aarav.sharma@campus.edu'}
                    />
                  </div>
                </label>

                <label className="field-label" style={{ marginBottom: '14px' }}>
                  Password
                  <div className="input-with-action">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      className="toggle-pw-btn"
                      onClick={() => setShowPassword(v => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                    </button>
                  </div>
                </label>

                <div className="auth-meta-row">
                  <label className="remember-label">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                    />
                    Remember session
                  </label>
                  <span className="muted" style={{ fontSize: '10.5px' }}>
                    React Authentication
                  </span>
                </div>

                <button className="btn primary full" type="submit">
                  <LogIn size={16}/>
                  Sign in as {selectedRole === 'admin' ? 'Administrator' : 'Student'} <span>→</span>
                </button>
              </form>

              <div className="demo-creds-box">
                <div className="demo-creds-title">
                  <span>Demo Credentials (1-Click Fill)</span>
                  <KeyRound size={13}/>
                </div>
                <div className="demo-chips">
                  <button
                    type="button"
                    className="demo-chip"
                    onClick={() => fillQuickDemo('admin', 'admin@campus.edu', 'admin123')}
                  >
                    <strong>Admin:</strong> admin@campus.edu / admin123
                  </button>
                  <button
                    type="button"
                    className="demo-chip student-chip"
                    onClick={() => fillQuickDemo('student', '101', 'student123')}
                  >
                    <strong>Student:</strong> Roll 101 / student123
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <span className="eyebrow">NEW REGISTRATION</span>
              <h2>Student Registration</h2>
              <p className="muted">Create a new student profile to access your dashboard.</p>

              {errorMsg && (
                <div className="auth-alert error">
                  <AlertCircle size={16}/>
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="stack-form">
                <label className="field-label">
                  Full name
                  <input
                    required
                    value={regForm.name}
                    onChange={e => setRegForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Tanvi Joshi"
                  />
                </label>

                <div className="form-grid">
                  <label className="field-label">
                    Roll number
                    <input
                      required
                      value={regForm.rollNo}
                      onChange={e => setRegForm(f => ({ ...f, rollNo: e.target.value }))}
                      placeholder="e.g. 151"
                    />
                  </label>
                  <label className="field-label">
                    Class / Branch
                    <select
                      value={regForm.className}
                      onChange={e => setRegForm(f => ({ ...f, className: e.target.value }))}
                    >
                      <option>CSE</option>
                      <option>IT</option>
                      <option>ECE</option>
                      <option>DS</option>
                      <option>ME</option>
                      <option>CE</option>
                    </select>
                  </label>
                </div>

                <div className="form-grid">
                  <label className="field-label">
                    Section
                    <select
                      value={regForm.section}
                      onChange={e => setRegForm(f => ({ ...f, section: e.target.value }))}
                    >
                      <option>A</option>
                      <option>B</option>
                      <option>C</option>
                      <option>D</option>
                    </select>
                  </label>
                  <label className="field-label">
                    Batch
                    <input
                      value={regForm.batch}
                      onChange={e => setRegForm(f => ({ ...f, batch: e.target.value }))}
                      placeholder="2027"
                    />
                  </label>
                </div>

                <label className="field-label">
                  Email address
                  <input
                    type="email"
                    value={regForm.email}
                    onChange={e => setRegForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="e.g. tanvi.joshi@campus.edu"
                  />
                </label>

                <div className="form-grid">
                  <label className="field-label">
                    Password
                    <input
                      type="password"
                      required
                      value={regForm.password}
                      onChange={e => setRegForm(f => ({ ...f, password: e.target.value }))}
                      placeholder="Min 6 characters"
                    />
                  </label>
                  <label className="field-label">
                    Confirm Password
                    <input
                      type="password"
                      required
                      value={regForm.confirmPassword}
                      onChange={e => setRegForm(f => ({ ...f, confirmPassword: e.target.value }))}
                      placeholder="Confirm"
                    />
                  </label>
                </div>

                <button className="btn primary full" type="submit" style={{ marginTop: '8px' }}>
                  <UserPlus size={16}/> Create Account & Sign In <span>→</span>
                </button>
              </form>
            </>
          )}

          <div className="auth-switch">
            {authMode === 'login' ? (
              <span>New student? <button type="button" onClick={() => { setAuthMode('register'); setErrorMsg(''); }}>Register your account</button></span>
            ) : (
              <span>Already registered? <button type="button" onClick={() => { setAuthMode('login'); setErrorMsg(''); }}>Back to Sign In</button></span>
            )}
          </div>
        </div>

        <div className="login-bottom">
          CampusDesk • Student Record Management • React Authentication Only
        </div>
      </div>
    </div>
  );
}

function PageHeading({ eyebrow, title, subtitle, action }) {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

function StatCard({ label, value, note, icon: Icon, tone }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}><Icon size={20}/></div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-note">{note}</div>
    </div>
  );
}

function Overview({ students, attendance, assignments, go, onResetDemo }) {
  const present = attendance.filter(a => a.status === 'Present').length;
  const attendanceRate = attendance.length ? `${Math.round((present / attendance.length) * 100)}%` : '—';

  return (
    <>
      <PageHeading
        eyebrow="ADMINISTRATOR"
        title="Good afternoon 👋"
        subtitle="Here's what's happening across your student records today."
        action={
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn primary" onClick={() => go('students')}>
              <Plus size={17}/> Add student
            </button>
          </div>
        }
      />

      <div className="stats-grid">
        <StatCard label="Total students" value={students.length} note="Currently registered (50 demo)" icon={Users} tone="blue"/>
        <StatCard label="Attendance records" value={attendance.length} note="All dates combined" icon={ClipboardCheck} tone="green"/>
        <StatCard label="Assignments" value={assignments.length} note="PDFs shared with students" icon={FileText} tone="purple"/>
        <StatCard label="Present rate" value={attendanceRate} note="Across recorded attendance" icon={CalendarDays} tone="orange"/>
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h3>Recently added students</h3>
              <p>Your student directory at a glance (showing recent entries)</p>
            </div>
            <button className="text-btn" onClick={() => go('students')}>View all <span>→</span></button>
          </div>
          {students.length ? (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Roll no.</th>
                    <th>Class / section</th>
                  </tr>
                </thead>
                <tbody>
                  {students.slice(0, 6).map(s => (
                    <tr key={s.id}>
                      <td>
                        <div className="student-cell">
                          <div className="avatar table-avatar">{s.name[0]}</div>
                          <div>
                            <strong>{s.name}</strong>
                            {s.email && <small style={{ display: 'block', fontSize: '9.5px', color: '#9096a8' }}>{s.email}</small>}
                          </div>
                        </div>
                      </td>
                      <td>{s.rollNo}</td>
                      <td>{s.className} · {s.section}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty title="No students yet" text="Add your first student to get started."/>
          )}
        </section>

        <section className="panel quick-panel">
          <div className="panel-heading">
            <div>
              <h3>Quick actions</h3>
              <p>Jump straight into a task</p>
            </div>
          </div>
          <button className="quick-action" onClick={() => go('students')}>
            <span className="quick-icon blue"><Users size={18}/></span>
            <span>
              <strong>Manage students</strong>
              <small>Browse all 50 student records</small>
            </span>
            <span className="quick-arrow">→</span>
          </button>
          <button className="quick-action" onClick={() => go('attendance')}>
            <span className="quick-icon green"><ClipboardCheck size={18}/></span>
            <span>
              <strong>Mark attendance</strong>
              <small>Record today's attendance</small>
            </span>
            <span className="quick-arrow">→</span>
          </button>
          <button className="quick-action" onClick={() => go('assignments')}>
            <span className="quick-icon purple"><Upload size={18}/></span>
            <span>
              <strong>Share an assignment</strong>
              <small>Upload a PDF for students</small>
            </span>
            <span className="quick-arrow">→</span>
          </button>
        </section>
      </div>
    </>
  );
}

function Students({ students, setStudents, search, setSearch, notify }) {
  const [formOpen, setFormOpen] = useState(false);
  const [classFilter, setClassFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [form, setForm] = useState({ name: '', className: 'CSE', rollNo: '', section: 'A', batch: '2027', email: '' });

  const classes = ['ALL', 'CSE', 'IT', 'ECE', 'DS', 'ME', 'CE'];

  const filtered = useMemo(() => {
    return students.filter(s => {
      const matchSearch = `${s.name} ${s.rollNo} ${s.className} ${s.section} ${s.batch || ''} ${s.email || ''}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchClass = classFilter === 'ALL' || s.className === classFilter;
      return matchSearch && matchClass;
    });
  }, [students, search, classFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const add = (e) => {
    e.preventDefault();
    if (students.some(s => s.rollNo.trim() === form.rollNo.trim())) {
      notify('That roll number already exists.');
      return;
    }
    const newStudent = {
      id: crypto.randomUUID(),
      name: form.name.trim(),
      rollNo: form.rollNo.trim(),
      className: form.className,
      section: form.section,
      batch: form.batch || '2027',
      email: form.email.trim() || `${form.name.toLowerCase().replace(/\s+/g, '.')}@campus.edu`,
      password: 'student123'
    };
    setStudents(prev => [newStudent, ...prev]);
    setForm({ name: '', className: 'CSE', rollNo: '', section: 'A', batch: '2027', email: '' });
    setFormOpen(false);
    notify('Student record added successfully.');
  };

  const remove = (s) => {
    if (window.confirm(`Delete the student record for ${s.name} (Roll no. ${s.rollNo})?`)) {
      setStudents(prev => prev.filter(x => x.id !== s.id));
      notify('Student record deleted.');
    }
  };

  return (
    <>
      <PageHeading
        eyebrow="DIRECTORY"
        title="Students"
        subtitle={`Create, search, filter and maintain student records (${students.length} total).`}
        action={
          <button className="btn primary" onClick={() => setFormOpen(v => !v)}>
            <Plus size={17}/>
            {formOpen ? 'Cancel' : 'Add student'}
          </button>
        }
      />

      {formOpen && (
        <section className="panel form-panel">
          <div className="panel-heading">
            <div>
              <h3>New student record</h3>
              <p>Fill in the student's basic details.</p>
            </div>
          </div>
          <form className="form-grid" onSubmit={add}>
            <label className="field-label">
              Full name
              <input
                required
                value={form.name}
                onChange={e => update('name', e.target.value)}
                placeholder="e.g. Priya Sharma"
              />
            </label>
            <label className="field-label">
              Roll number
              <input
                required
                value={form.rollNo}
                onChange={e => update('rollNo', e.target.value)}
                placeholder="e.g. 151"
              />
            </label>
            <label className="field-label">
              Class / programme
              <select value={form.className} onChange={e => update('className', e.target.value)}>
                <option>CSE</option>
                <option>IT</option>
                <option>ECE</option>
                <option>DS</option>
                <option>ME</option>
                <option>CE</option>
              </select>
            </label>
            <label className="field-label">
              Section
              <select value={form.section} onChange={e => update('section', e.target.value)}>
                <option>A</option>
                <option>B</option>
                <option>C</option>
                <option>D</option>
              </select>
            </label>
            <label className="field-label">
              Batch / year
              <input
                value={form.batch}
                onChange={e => update('batch', e.target.value)}
                placeholder="e.g. 2027"
              />
            </label>
            <label className="field-label">
              Email (optional)
              <input
                type="email"
                value={form.email}
                onChange={e => update('email', e.target.value)}
                placeholder="e.g. priya.sharma@campus.edu"
              />
            </label>
            <div className="form-actions">
              <button className="btn primary" type="submit">Save record</button>
              <button className="btn secondary" type="button" onClick={() => setFormOpen(false)}>Cancel</button>
            </div>
          </form>
        </section>
      )}

      <section className="panel">
        <div className="panel-heading directory-heading">
          <div>
            <h3>
              Student directory <span className="count-badge">{filtered.length}</span>
            </h3>
            <p>Showing {filtered.length} of {students.length} registered students</p>
          </div>
          <div className="search-box">
            <Search size={16}/>
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name, roll no, class..."
            />
          </div>
        </div>

        <div className="table-controls">
          <div className="class-filter-pills">
            {classes.map(c => (
              <button
                key={c}
                type="button"
                className={`class-pill ${classFilter === c ? 'active' : ''}`}
                onClick={() => { setClassFilter(c); setPage(1); }}
              >
                {c === 'ALL' ? 'All Classes' : c}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: '#858c9d' }}>Rows:</span>
            <select
              value={pageSize}
              onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
              style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '11px', border: '1px solid #e1e4ed' }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Student name</th>
                <th>Roll number</th>
                <th>Email</th>
                <th>Class</th>
                <th>Section</th>
                <th>Batch</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(s => (
                <tr key={s.id}>
                  <td>
                    <div className="student-cell">
                      <div className="avatar table-avatar">{s.name[0]}</div>
                      <strong>{s.name}</strong>
                    </div>
                  </td>
                  <td><strong>{s.rollNo}</strong></td>
                  <td><span style={{ color: '#747b8e', fontSize: '10.5px' }}>{s.email || `${s.rollNo}@campus.edu`}</span></td>
                  <td>{s.className}</td>
                  <td>{s.section}</td>
                  <td>{s.batch || '—'}</td>
                  <td>
                    <button
                      className="icon-btn danger"
                      onClick={() => remove(s)}
                      aria-label={`Delete ${s.name}`}
                      title="Delete record"
                    >
                      <Trash2 size={16}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!filtered.length && (
            <Empty title="No matching students" text="Try a different search query or select another class filter."/>
          )}
        </div>

        {filtered.length > pageSize && (
          <div className="pagination">
            <span className="page-info">
              Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} students
            </span>
            <div className="page-numbers">
              <button
                className="page-btn"
                disabled={currentPage === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                aria-label="Previous page"
              >
                <ChevronLeft size={15}/>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                <button
                  key={pageNum}
                  className={`page-btn ${pageNum === currentPage ? 'active' : ''}`}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </button>
              ))}
              <button
                className="page-btn"
                disabled={currentPage === totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                aria-label="Next page"
              >
                <ChevronRight size={15}/>
              </button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

function Attendance({ students, attendance, setAttendance, notify }) {
  const [filters, setFilters] = useState({
    className: 'CSE',
    section: 'A',
    batch: '2027',
    subject: 'Data Structures',
    date: today()
  });
  const [marks, setMarks] = useState({});

  const matching = students.filter(
    s => s.className === filters.className &&
         s.section === filters.section &&
         (!filters.batch || s.batch === filters.batch)
  );

  const update = (k, v) => setFilters(f => ({ ...f, [k]: v }));

  useEffect(() => {
    const next = {};
    matching.forEach(s => {
      const existing = attendance.find(
        a => a.studentId === s.id && a.date === filters.date && a.subject === filters.subject
      );
      next[s.id] = existing?.status || 'Present';
    });
    setMarks(next);
  }, [filters.className, filters.section, filters.batch, filters.subject, filters.date, students.length]);

  const save = () => {
    const rows = matching.map(s => ({
      id: `${s.id}-${filters.date}-${filters.subject}`,
      studentId: s.id,
      studentName: s.name,
      rollNo: s.rollNo,
      className: s.className,
      section: s.section,
      batch: s.batch,
      date: filters.date,
      subject: filters.subject,
      status: marks[s.id] || 'Present'
    }));

    const keys = new Set(rows.map(r => r.id));
    setAttendance(prev => [...prev.filter(a => !keys.has(a.id)), ...rows]);
    notify(`Saved attendance for ${matching.length} students (${filters.subject}).`);
  };

  const markAll = (status) => {
    const updated = {};
    matching.forEach(s => {
      updated[s.id] = status;
    });
    setMarks(updated);
  };

  return (
    <>
      <PageHeading
        eyebrow="DAILY TRACKING"
        title="Attendance"
        subtitle="Mark and save attendance by class, section, subject and date."
      />

      <section className="panel">
        <div className="filter-grid">
          <label className="field-label">
            Class
            <select value={filters.className} onChange={e => update('className', e.target.value)}>
              {['CSE', 'IT', 'ECE', 'DS', 'ME', 'CE'].map(x => <option key={x}>{x}</option>)}
            </select>
          </label>
          <label className="field-label">
            Section
            <select value={filters.section} onChange={e => update('section', e.target.value)}>
              {['A', 'B', 'C', 'D'].map(x => <option key={x}>{x}</option>)}
            </select>
          </label>
          <label className="field-label">
            Batch
            <input value={filters.batch} onChange={e => update('batch', e.target.value)}/>
          </label>
          <label className="field-label">
            Subject
            <input value={filters.subject} onChange={e => update('subject', e.target.value)}/>
          </label>
          <label className="field-label">
            Date
            <input type="date" value={filters.date} onChange={e => update('date', e.target.value)}/>
          </label>
        </div>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h3>Class register</h3>
            <p>{matching.length} students enrolled in {filters.className} Section {filters.section} · {filters.date}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div className="attendance-legend">
              <span><i className="dot present-dot"/> Present</span>
              <span><i className="dot absent-dot"/> Absent</span>
            </div>
            {matching.length > 0 && (
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  className="btn secondary compact"
                  onClick={() => markAll('Present')}
                  style={{ fontSize: '10.5px' }}
                >
                  All Present
                </button>
                <button
                  type="button"
                  className="btn secondary compact"
                  onClick={() => markAll('Absent')}
                  style={{ fontSize: '10.5px' }}
                >
                  All Absent
                </button>
              </div>
            )}
          </div>
        </div>

        {matching.length ? (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Roll no.</th>
                    <th>Attendance status</th>
                  </tr>
                </thead>
                <tbody>
                  {matching.map(s => (
                    <tr key={s.id}>
                      <td>
                        <div className="student-cell">
                          <div className="avatar table-avatar">{s.name[0]}</div>
                          <strong>{s.name}</strong>
                        </div>
                      </td>
                      <td>{s.rollNo}</td>
                      <td>
                        <div className="status-toggle">
                          <button
                            type="button"
                            className={marks[s.id] === 'Present' ? 'chosen present' : ''}
                            onClick={() => setMarks(m => ({ ...m, [s.id]: 'Present' }))}
                          >
                            <CheckCircle2 size={15}/> Present
                          </button>
                          <button
                            type="button"
                            className={marks[s.id] === 'Absent' ? 'chosen absent' : ''}
                            onClick={() => setMarks(m => ({ ...m, [s.id]: 'Absent' }))}
                          >
                            <XCircle size={15}/> Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="panel-footer">
              <span className="muted">
                {Object.values(marks).filter(x => x === 'Present').length} present · {Object.values(marks).filter(x => x === 'Absent').length} absent
              </span>
              <button className="btn primary" onClick={save}>Save attendance</button>
            </div>
          </>
        ) : (
          <Empty
            title="No students in this group"
            text="Add students to this class/section or choose a different combination."
          />
        )}
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h3>Recent attendance records</h3>
            <p>Saved attendance entries in this session</p>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Student</th>
                <th>Roll No</th>
                <th>Subject</th>
                <th>Class / Sec</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[...attendance]
                .sort((a, b) => b.date.localeCompare(a.date))
                .slice(0, 10)
                .map(a => (
                  <tr key={a.id}>
                    <td>{a.date}</td>
                    <td><strong>{a.studentName}</strong></td>
                    <td>{a.rollNo}</td>
                    <td>{a.subject}</td>
                    <td>{a.className} · {a.section}</td>
                    <td>
                      <span className={`status-badge ${a.status.toLowerCase()}`}>{a.status}</span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {!attendance.length && (
            <Empty title="No attendance saved" text="Mark attendance above and save the register."/>
          )}
        </div>
      </section>
    </>
  );
}

function AdminAssignments({ assignments, setAssignments, submissions, notify }) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [file, setFile] = useState(null);

  const add = (e) => {
    e.preventDefault();
    if (!file) return;
    if (file.type !== 'application/pdf') {
      notify('Please choose a PDF file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      notify('PDF must be smaller than 5 MB in this demo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAssignments(prev => [
        {
          id: crypto.randomUUID(),
          title: title.trim(),
          subject: subject.trim(),
          dueDate,
          fileName: file.name,
          dataUrl: reader.result,
          createdAt: today()
        },
        ...prev
      ]);
      setTitle('');
      setSubject('');
      setDueDate('');
      setFile(null);
      e.target.reset();
      notify('Assignment PDF uploaded and shared with students.');
    };
    reader.readAsDataURL(file);
  };

  const remove = (a) => {
    if (window.confirm(`Delete assignment "${a.title}"?`)) {
      setAssignments(prev => prev.filter(x => x.id !== a.id));
      notify('Assignment deleted.');
    }
  };

  return (
    <>
      <PageHeading
        eyebrow="LEARNING MATERIALS"
        title="Assignments"
        subtitle="Upload PDF assignments and share them with student accounts."
      />

      <div className="dashboard-grid assignments-grid">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h3>Upload an assignment</h3>
              <p>PDF files up to 5 MB for this browser demo</p>
            </div>
            <span className="upload-symbol"><Upload size={20}/></span>
          </div>

          <form onSubmit={add} className="stack-form">
            <label className="field-label">
              Assignment title
              <input
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. DSA Worksheet 3"
              />
            </label>
            <label className="field-label">
              Subject
              <input
                required
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="e.g. Data Structures"
              />
            </label>
            <label className="field-label">
              Due date
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
              />
            </label>
            <label className="file-drop">
              <Upload size={24}/>
              <strong>{file?.name || 'Choose a PDF file'}</strong>
              <span>{file ? `${(file.size / 1024).toFixed(0)} KB selected` : 'PDF format · max 5 MB'}</span>
              <input
                type="file"
                accept="application/pdf,.pdf"
                required
                onChange={e => setFile(e.target.files?.[0] || null)}
              />
            </label>
            <button className="btn primary full" type="submit">
              <Upload size={17}/> Upload assignment
            </button>
          </form>
        </section>

        <section className="panel">
          <div className="panel-heading">
            <div>
              <h3>Student submissions</h3>
              <p>Submitted work from students</p>
            </div>
            <span className="count-badge">{submissions.length}</span>
          </div>
          {submissions.length ? (
            submissions.map(s => (
              <div className="submission-row" key={s.id}>
                <div className="file-icon"><FileText size={19}/></div>
                <div className="submission-info">
                  <strong>{s.assignmentTitle}</strong>
                  <small>{s.studentName} · {s.fileName} {s.submittedAt && `(${s.submittedAt})`}</small>
                </div>
                <span className="status-badge submitted">Submitted</span>
              </div>
            ))
          ) : (
            <Empty title="No submissions yet" text="Student submissions will appear here when uploaded."/>
          )}
        </section>
      </div>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h3>Published assignments <span className="count-badge">{assignments.length}</span></h3>
            <p>PDF assignments visible to students</p>
          </div>
        </div>
        {assignments.length ? (
          <div className="assignment-list">
            {assignments.map(a => (
              <div className="assignment-row" key={a.id}>
                <div className="file-icon"><FileText size={20}/></div>
                <div className="assignment-info">
                  <strong>{a.title}</strong>
                  <span>{a.subject} · {a.fileName}</span>
                  <small>{a.dueDate ? `Due ${a.dueDate}` : 'No due date'} · Added {a.createdAt}</small>
                </div>
                <a
                  className="icon-btn"
                  href={a.dataUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="View PDF"
                  title="View PDF"
                >
                  <Eye size={17}/>
                </a>
                <button
                  className="icon-btn danger"
                  onClick={() => remove(a)}
                  aria-label="Delete assignment"
                  title="Delete assignment"
                >
                  <Trash2 size={17}/>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <Empty title="No assignments uploaded" text="Upload a PDF using the form above to share it with students."/>
        )}
      </section>
    </>
  );
}

function StudentHome({ student, attendance, assignments, submissions, go }) {
  const mine = attendance.filter(a => a.studentId === student?.id);
  const presentCount = mine.filter(a => a.status === 'Present').length;
  const rate = mine.length ? `${Math.round((presentCount / mine.length) * 100)}%` : '—';
  const mySubmissions = submissions.filter(s => s.studentId === student?.id);

  return (
    <>
      <PageHeading
        eyebrow="STUDENT PORTAL"
        title={`Welcome, ${student?.name?.split(' ')[0] || 'student'} 👋`}
        subtitle="Here's a quick look at your academic activity."
      />

      <div className="student-welcome">
        <div>
          <span className="eyebrow">YOUR STUDENT PROFILE</span>
          <h2>{student?.name || 'Student'}</h2>
          <p>
            {student?.className || '—'} · Section {student?.section || '—'} · Batch {student?.batch || '—'} · {student?.email || '—'}
          </p>
        </div>
        <div className="profile-roll">
          <span>ROLL NUMBER</span>
          <strong>{student?.rollNo || '—'}</strong>
        </div>
      </div>

      <div className="stats-grid three">
        <StatCard
          label="Attendance rate"
          value={rate}
          note={`${presentCount} present out of ${mine.length} classes`}
          icon={ClipboardCheck}
          tone="green"
        />
        <StatCard
          label="Available assignments"
          value={assignments.length}
          note="PDFs shared by department"
          icon={FileText}
          tone="purple"
        />
        <StatCard
          label="My submissions"
          value={mySubmissions.length}
          note="Assignments submitted"
          icon={CheckCircle2}
          tone="blue"
        />
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h3>Latest assignments</h3>
              <p>Work shared by your department faculty</p>
            </div>
            <button className="text-btn" onClick={() => go('my-assignments')}>View all →</button>
          </div>
          {assignments.slice(0, 3).length ? (
            assignments.slice(0, 3).map(a => (
              <div className="submission-row" key={a.id}>
                <div className="file-icon"><FileText size={19}/></div>
                <div className="submission-info">
                  <strong>{a.title}</strong>
                  <small>{a.subject} · {a.dueDate ? `Due ${a.dueDate}` : 'No due date'}</small>
                </div>
              </div>
            ))
          ) : (
            <Empty title="Nothing assigned yet" text="New assignments will appear here."/>
          )}
        </section>

        <section className="panel quick-panel">
          <div className="panel-heading">
            <div>
              <h3>Quick links</h3>
              <p>Pick up where you left off</p>
            </div>
          </div>
          <button className="quick-action" onClick={() => go('my-attendance')}>
            <span className="quick-icon green"><ClipboardCheck size={18}/></span>
            <span>
              <strong>View attendance</strong>
              <small>Review your attendance records</small>
            </span>
            <span className="quick-arrow">→</span>
          </button>
          <button className="quick-action" onClick={() => go('my-assignments')}>
            <span className="quick-icon purple"><BookOpen size={18}/></span>
            <span>
              <strong>Assignments</strong>
              <small>View PDFs and submit your work</small>
            </span>
            <span className="quick-arrow">→</span>
          </button>
        </section>
      </div>
    </>
  );
}

function StudentAttendance({ student, attendance }) {
  const mine = attendance
    .filter(a => a.studentId === student?.id)
    .sort((a, b) => b.date.localeCompare(a.date));

  const presentCount = mine.filter(a => a.status === 'Present').length;
  const rate = mine.length ? Math.round((presentCount / mine.length) * 100) : 0;

  return (
    <>
      <PageHeading
        eyebrow="MY ACADEMICS"
        title="My attendance"
        subtitle="Review attendance records saved for your roll number."
      />

      <div className="attendance-summary">
        <div>
          <span>OVERALL ATTENDANCE</span>
          <strong>{mine.length ? `${rate}%` : '—'}</strong>
        </div>
        <div className="progress-track">
          <div style={{ width: `${rate}%` }}/>
        </div>
        <small>{presentCount} present out of {mine.length} recorded sessions</small>
      </div>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h3>Attendance history</h3>
            <p>{mine.length} records found for {student?.name} ({student?.rollNo})</p>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Subject</th>
                <th>Class</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mine.map(a => (
                <tr key={a.id}>
                  <td>{a.date}</td>
                  <td><strong>{a.subject}</strong></td>
                  <td>{a.className} · {a.section}</td>
                  <td>
                    <span className={`status-badge ${a.status.toLowerCase()}`}>{a.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!mine.length && (
            <Empty
              title="No attendance records yet"
              text="Your attendance will show here once the administrator records it."
            />
          )}
        </div>
      </section>
    </>
  );
}

function StudentAssignments({ student, assignments, submissions, setSubmissions, notify }) {
  const [selectedFiles, setSelectedFiles] = useState({});
  const [filter, setFilter] = useState('all');

  const mine = submissions.filter(s => s.studentId === student?.id);
  const isSubmitted = (a) => mine.some(s => s.assignmentId === a.id);

  const list = assignments.filter(
    a => filter === 'all' || (filter === 'submitted' ? isSubmitted(a) : !isSubmitted(a))
  );

  const submit = (a) => {
    const f = selectedFiles[a.id];
    if (!f) {
      notify('Choose a file before submitting.');
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      notify('File must be smaller than 5 MB in this demo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSubmissions(prev => [
        ...prev.filter(s => !(s.assignmentId === a.id && s.studentId === student?.id)),
        {
          id: crypto.randomUUID(),
          assignmentId: a.id,
          assignmentTitle: a.title,
          studentId: student?.id,
          studentName: student?.name,
          fileName: f.name,
          dataUrl: reader.result,
          submittedAt: today()
        }
      ]);
      notify(`Assignment "${a.title}" submitted successfully!`);
    };
    reader.readAsDataURL(f);
  };

  return (
    <>
      <PageHeading
        eyebrow="LEARNING MATERIALS"
        title="Assignments"
        subtitle="Download assignment PDFs and upload your completed work."
      />

      <div className="filter-tabs">
        <button
          className={filter === 'all' ? 'selected' : ''}
          onClick={() => setFilter('all')}
        >
          All assignments <span>{assignments.length}</span>
        </button>
        <button
          className={filter === 'pending' ? 'selected' : ''}
          onClick={() => setFilter('pending')}
        >
          Pending <span>{assignments.filter(a => !isSubmitted(a)).length}</span>
        </button>
        <button
          className={filter === 'submitted' ? 'selected' : ''}
          onClick={() => setFilter('submitted')}
        >
          Submitted <span>{mine.length}</span>
        </button>
      </div>

      <div className="student-assignment-list">
        {list.map(a => (
          <section className="panel student-assignment" key={a.id}>
            <div className="assignment-row">
              <div className="file-icon"><FileText size={21}/></div>
              <div className="assignment-info">
                <strong>{a.title}</strong>
                <span>{a.subject}</span>
                <small>{a.dueDate ? `Due ${a.dueDate}` : 'No due date'} · {a.fileName}</small>
              </div>
              <span className={`status-badge ${isSubmitted(a) ? 'submitted' : 'pending'}`}>
                {isSubmitted(a) ? 'Submitted' : 'Pending'}
              </span>
              <a
                className="btn secondary compact"
                href={a.dataUrl}
                target="_blank"
                rel="noreferrer"
              >
                <Download size={15}/> View PDF
              </a>
            </div>

            {!isSubmitted(a) && (
              <div className="submit-area">
                <label className="field-label">
                  Your completed assignment
                  <input
                    type="file"
                    onChange={e => setSelectedFiles(prev => ({ ...prev, [a.id]: e.target.files?.[0] || null }))}
                  />
                </label>
                <button className="btn primary" onClick={() => submit(a)}>
                  <Send size={16}/> Submit work
                </button>
              </div>
            )}

            {isSubmitted(a) && (
              <div className="submitted-note">
                <CheckCircle2 size={16}/> Submitted on {mine.find(s => s.assignmentId === a.id)?.submittedAt}
              </div>
            )}
          </section>
        ))}

        {!list.length && (
          <section className="panel">
            <Empty
              title={assignments.length ? 'No assignments in this filter' : 'No assignments available'}
              text={assignments.length ? 'Try another filter to see your assignments.' : 'Your administrator has not uploaded any assignments yet.'}
            />
          </section>
        )}
      </div>
    </>
  );
}

function Empty({ title, text }) {
  return (
    <div className="empty-state">
      <div className="empty-icon"><FileText size={21}/></div>
      <strong>{title}</strong>
      <p>{text}</p>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>
);
