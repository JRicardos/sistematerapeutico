import React from 'react';

const PatientRegistrationStep2 = ({ patientData, setPatientData, onNavigate, onBack, onRegister }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (patientData.psychologistId) {
      onRegister(patientData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-800">Cadastro - Passo 2</h1>
          <div className="w-6"></div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID do Psicólogo</label>
              <input
                type="text"
                value={patientData.psychologistId}
                onChange={(e) => setPatientData({...patientData, psychologistId: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="ID do seu psicólogo"
                required
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Importante:</strong> Solicite o ID do seu psicólogo para completar o cadastro.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
            >
              Finalizar Cadastro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientRegistrationStep2;