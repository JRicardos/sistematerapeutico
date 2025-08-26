import React, { useState, useEffect } from "react";
import { useAuth } from './hooks/useAuth';
import { api } from "./services/api";
import SignupScreen from './components/SignupScreen';
import LoginScreen from './components/LoginScreen';
import PatientLogin from './components/Patient/Login';
import PatientRegistrationStep1 from './components/Patient/RegistrationStep1';
import PatientRegistrationStep2 from './components/Patient/RegistrationStep2';
import PatientDashboard from './components/Patient/Dashboard';
import PsychologistLogin from './components/Psychologist/Login';
import PsychologistDashboard from './components/Psychologist/Dashboard';
import DailyEntry from './components/Patient/DailyEntry';

const App = () => {
  const { user, loading, signIn, signUp, signOut } = useAuth();
  const [currentView, setCurrentView] = useState("signup"); // Começa com signup
  const [userType, setUserType] = useState(null);
  const [loginData, setLoginData] = useState({ 
    email: "", 
    password: ""
  });
  const [patientData, setPatientData] = useState({
    name: "",
    cpf: "",
    psychologistId: "",
    phone: "",
  });
  const [dailyEntry, setDailyEntry] = useState({
    mood: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });
  const [therapeuticPractices, setTherapeuticPractices] = useState([]);
  const [patientsList, setPatientsList] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalPatients: 0,
    activeSessions: 0,
    averageMood: 0,
  });
  const [showAddPractice, setShowAddPractice] = useState(false);
  const [newPractice, setNewPractice] = useState("");
  const [editingPatient, setEditingPatient] = useState(null);
  const [editedPatient, setEditedPatient] = useState({});
  const [registrationStep, setRegistrationStep] = useState(1);

  // Carregar dados do Supabase quando usuário logar
  useEffect(() => {
    console.log('Supabase URL:', process.env.REACT_APP_SUPABASE_URL);
    console.log('Supabase Key:', process.env.REACT_APP_SUPABASE_ANON_KEY);
    const loadData = async () => {
      if (user && userType === "psychologist") {
        try {
          // Carregar práticas terapêuticas
          const { data: practices, error: practicesError } = await api.getTherapeuticPractices();
          if (!practicesError && practices) {
            setTherapeuticPractices(practices);
          }

          // Carregar pacientes
          const { data: patients, error: patientsError } = await api.getPsychologistPatients(user.id);
          if (!patientsError && patients) {
            setPatientsList(patients);
          }

          // Carregar dados do dashboard
          const dashboard = await api.getPsychologistDashboard(user.id);
          setDashboardData(dashboard);
        } catch (error) {
          console.error("Erro ao carregar dados:", error);
        }
      } else if (user && userType === "patient") {
        try {
          // Carregar práticas do paciente
          const { data: practices, error } = await api.getPatientPractices(user.id);
          if (!error && practices) {
            setTherapeuticPractices(practices);
          }
        } catch (error) {
          console.error("Erro ao carregar práticas do paciente:", error);
        }
      }
    };

    loadData();
  }, [user, userType]);

  // Se estiver carregando a autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se usuário estiver autenticado, mostra o conteúdo principal
  if (user) {
    if (userType === "psychologist") {
      return (
        <PsychologistDashboard 
          onLogout={() => {
            signOut();
            setUserType(null);
            setCurrentView("login");
          }}
          patients={patientsList}
          practices={therapeuticPractices}
          dashboardData={dashboardData}
          onPatientsList={setPatientsList}
          onTherapeuticPractices={setTherapeuticPractices}
        />
      );
    } else {
      switch (currentView) {
        case "dailyEntry":
          return (
            <DailyEntry
              onBack={() => setCurrentView("patientDashboard")}
              onSave={async (entryData) => {
                try {
                  await api.saveDailyEntry({
                    ...entryData,
                    patient_id: user.id
                  });
                  setCurrentView("patientDashboard");
                } catch (error) {
                  console.error("Erro ao salvar registro:", error);
                }
              }}
            />
          );
        default:
          return (
            <PatientDashboard 
              onNavigate={setCurrentView}
              onLogout={() => {
                signOut();
                setUserType(null);
                setCurrentView("login");
              }}
              practices={therapeuticPractices}
            />
          );
      }
    }
  }

  // Se não estiver autenticado, mostra telas de cadastro/login
  const handleSignup = async (signupData) => {
    try {
      const result = await signUp(
        signupData.email,
        signupData.password,
        {
          name: signupData.name,
          email: signupData.email,
          ...(signupData.userType === "psychologist" 
            ? { crp: signupData.crp }
            : { cpf: signupData.cpf }
          )
        },
        signupData.userType
      );
      
      if (result?.data?.user) {
        setUserType(signupData.userType);
        setCurrentView("login");
      }
    } catch (error) {
      console.error("Erro no cadastro:", error);
      alert("Erro ao realizar cadastro. Tente novamente.");
    }
  };

  const handlePsychologistLogin = async (email, password) => {
    try {
      const result = await signIn(email, password);
      if (result?.data?.user) {
        setUserType("psychologist");
        setCurrentView("psychologistDashboard");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      alert("Erro ao fazer login. Verifique suas credenciais.");
    }
  };

  const handlePatientLogin = async (email, password) => {
    try {
      const result = await signIn(email, password);
      if (result?.data?.user) {
        setUserType("patient");
        setCurrentView("patientDashboard");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      alert("Erro ao fazer login. Verifique suas credenciais.");
    }
  };

  switch (currentView) {
    case "signup":
      return <SignupScreen onNavigate={setCurrentView} onSignup={handleSignup} />;
    
    case "login":
      return <LoginScreen onNavigate={setCurrentView} />;
    
    case "patientLogin":
      return (
        <PatientLogin 
          onLogin={handlePatientLogin}
          onBack={() => setCurrentView("login")}
        />
      );
    
    case "patientRegistration":
      return (
        <PatientRegistrationStep1
          patientData={patientData}
          setPatientData={setPatientData}
          onNavigate={setCurrentView}
          onBack={() => setCurrentView("login")}
        />
      );
    
    case "patientRegistrationStep2":
      return (
        <PatientRegistrationStep2
          patientData={patientData}
          setPatientData={setPatientData}
          onNavigate={setCurrentView}
          onBack={() => setCurrentView("patientRegistration")}
          onRegister={(data) => {
            // Aqui você pode implementar o registro do paciente
            console.log("Registrando paciente:", data);
            setCurrentView("login");
          }}
        />
      );
    
    case "psychologistLogin":
      return (
        <PsychologistLogin
          onLogin={handlePsychologistLogin}
          onBack={() => setCurrentView("login")}
        />
      );
    
    default:
      return <SignupScreen onNavigate={setCurrentView} onSignup={handleSignup} />;
  }
};

export default App;