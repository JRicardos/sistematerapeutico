import React from 'react';

const PatientLogin = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 11.246a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Área do Paciente</h1>
          <p className="text-gray-600 mt-2">Acesse sua conta</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => onNavigate('patientRegistration')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200"
          >
            Entrar com meu Psicólogo
          </button>

          <button
            onClick={() => onNavigate('login')}
            className="w-full border border-gray-300 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-colors duration-200 hover:bg-gray-50"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientLogin;