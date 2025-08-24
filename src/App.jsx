import React, { useState, useEffect } from "react";
import { useAuth } from './hooks/useAuth';
import { api } from "./services/api";
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
  const [currentView, setCurrentView] = useState("login");
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
      switch (currentView) {
        case "psychologistDashboard":
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
              on patientsList={setPatientsList}
              onTherapeuticPractices={setTherapeuticPractices}
            />
          );
        default:
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
      }
    } else {
      switch (currentView) {
        case "patientDashboard":
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

  // Se não estiver autenticado, mostra tela de login
  const handlePsychologistLogin = async (email, password) => {
    try {
      const result = await signIn(email, password);
      if (result?.data?.user) {
        setUserType("psychologist");
        setCurrentView("psychologistDashboard");
      }
    } catch (error) {
      console.error("Erro no login:", error);
    }
  };

  const handlePatientRegistration = async (data) => {
    try {
      const result = await signUp(
        `${data.cpf}@paciente.com`, // Email temporário
        "senha123", // Senha padrão
        data,
        "patient"
      );
      if (result?.data?.user) {
        setUserType("patient");
        setCurrentView("patientDashboard");
      }
    } catch (error) {
      console.error("Erro no registro:", error);
    }
  };

  switch (currentView) {
    case "login":
      return <LoginScreen onNavigate={setCurrentView} />;
    
    case "patientLogin":
      return <PatientLogin onNavigate={setCurrentView} />;
    
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
          onRegister={handlePatientRegistration}
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
      return <LoginScreen onNavigate={setCurrentView} />;
  }
};

export default App;