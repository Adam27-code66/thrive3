import React, { createContext, useContext, useState } from 'react';
import { analyzeEmail, analyzeEmailFile } from '../services/api';

const AnalysisContext = createContext();

export const AnalysisProvider = ({ children }) => {
  const [currentResult, setCurrentResult] = useState(null);
  const [currentEmail, setCurrentEmail] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [error, setError] = useState(null);

  const steps = [
    "Extracting email indicators...",
    "Analyzing sender identity...",
    "Checking domain reputation & brand similarity...",
    "Scanning URLs & links payload...",
    "Analyzing NLP urgency & language threat patterns...",
    "Calculating explainable risk score...",
    "Generating security incident report..."
  ];

  const triggerStepAnimation = async () => {
    setIsAnalyzing(true);
    setError(null);
    for (let i = 0; i < steps.length; i++) {
      setAnalysisStep(i);
      await new Promise(r => setTimeout(r, 400));
    }
  };

  const runAnalysis = async (payload) => {
    try {
      setCurrentEmail(payload);
      const animationPromise = triggerStepAnimation();
      const apiPromise = analyzeEmail(payload);

      const [_, data] = await Promise.all([animationPromise, apiPromise]);
      setCurrentResult(data);
      setIsAnalyzing(false);
      return data;
    } catch (err) {
      setIsAnalyzing(false);
      setError(err.response?.data?.detail || err.message || "Analysis failed");
      throw err;
    }
  };

  const runFileAnalysis = async (formData) => {
    try {
      const animationPromise = triggerStepAnimation();
      const apiPromise = analyzeEmailFile(formData);

      const [_, data] = await Promise.all([animationPromise, apiPromise]);
      setCurrentResult(data);
      setIsAnalyzing(false);
      return data;
    } catch (err) {
      setIsAnalyzing(false);
      setError(err.response?.data?.detail || err.message || "File analysis failed");
      throw err;
    }
  };

  return (
    <AnalysisContext.Provider value={{
      currentResult,
      setCurrentResult,
      currentEmail,
      isAnalyzing,
      analysisStep,
      steps,
      error,
      runAnalysis,
      runFileAnalysis
    }}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => useContext(AnalysisContext);
