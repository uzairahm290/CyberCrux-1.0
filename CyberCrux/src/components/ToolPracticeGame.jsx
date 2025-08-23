import React, { useState, useEffect, useRef } from 'react';
import {FaStar, FaTrophy, FaPlay, FaRedo, FaCheck, FaTimes, FaInfoCircle } from 'react-icons/fa';
import { BiBrain, BiTargetLock } from 'react-icons/bi';
import confetti from 'canvas-confetti';

const ToolPracticeGame = ({ toolName, onGameComplete, onClose }) => {
  const [scenarios, setScenarios] = useState([]);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [currentCommand, setCurrentCommand] = useState([]);
  const [availablePieces, setAvailablePieces] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [timeStarted, setTimeStarted] = useState(null);
  const [timeTaken, setTimeTaken] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const dragItem = useRef();
  const dragOverItem = useRef();

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch scenarios from API
  useEffect(() => {
    fetchScenarios();
  }, [toolName]);



  const fetchScenarios = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/tool-practice/scenarios?tool_name=${toolName}`);
      const data = await response.json();
      
      if (data.success) {
        setScenarios(data.data);
        if (data.data.length > 0) {
          setAvailablePieces(data.data[0].command_pieces);
        }
      } else {
        setError('Failed to load scenarios');
      }
    } catch (err) {
      setError('Error loading scenarios');
      console.error('Error fetching scenarios:', err);
    } finally {
      setLoading(false);
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setTimeStarted(Date.now());
  };

  const handleDragStart = (e, index) => {
    dragItem.current = index;
  };

  const handleDragEnter = (e, index) => {
    e.preventDefault();
    dragOverItem.current = index;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    
    if (dragItem.current === null || dragOverItem.current === null) return;
    
    const newCommand = [...currentCommand];
    const draggedPiece = availablePieces[dragItem.current];
    
    // Remove from available pieces
    const newAvailablePieces = availablePieces.filter((_, index) => index !== dragItem.current);
    
    // Add to command at the end (append)
    newCommand.push(draggedPiece);
    
    setCurrentCommand(newCommand);
    setAvailablePieces(newAvailablePieces);
    
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const removeFromCommand = (index) => {
    const removedPiece = currentCommand[index];
    const newCommand = currentCommand.filter((_, i) => i !== index);
    const newAvailablePieces = [...availablePieces, removedPiece];
    
    setCurrentCommand(newCommand);
    setAvailablePieces(newAvailablePieces);
  };

  // Mobile-friendly: Add piece to command
  const addPieceToCommand = (piece, index) => {
    const newCommand = [...currentCommand, piece];
    const newAvailablePieces = availablePieces.filter((_, i) => i !== index);
    
    setCurrentCommand(newCommand);
    setAvailablePieces(newAvailablePieces);
  };

  const submitAnswer = async () => {
    const submittedCommand = currentCommand.join(' ');
    const timeElapsed = Math.floor((Date.now() - timeStarted) / 1000);
    
    try {
      const response = await fetch('http://localhost:5000/api/tool-practice/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          scenarioId: scenarios[currentScenarioIndex].id,
          submittedCommand
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setIsCorrect(data.isCorrect);
        setExplanation(data.explanation);
        setTimeTaken(timeElapsed);
        
        if (data.isCorrect) {
          setCorrectAnswers(correctAnswers + 1);
        }
        
        setShowResult(true);
      }
    } catch (err) {
      console.error('Error checking answer:', err);
    }
  };

  const nextScenario = () => {
    setShowResult(false);
    setCurrentCommand([]);
    setTimeTaken(0);
    
    if (currentScenarioIndex + 1 < scenarios.length) {
      setCurrentScenarioIndex(currentScenarioIndex + 1);
      setAvailablePieces(scenarios[currentScenarioIndex + 1].command_pieces);
      setTimeStarted(Date.now());
    } else {
      // Game completed
      setGameCompleted(true);
      triggerConfetti();
      if (onGameComplete) {
        onGameComplete(correctAnswers);
      }
    }
  };

  const retryScenario = () => {
    setShowResult(false);
    setCurrentCommand([]);
    setAvailablePieces(scenarios[currentScenarioIndex].command_pieces);
    setTimeStarted(Date.now());
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const resetGame = () => {
    setCurrentScenarioIndex(0);
    setCorrectAnswers(0);
    setGameStarted(false);
    setGameCompleted(false);
    setCurrentCommand([]);
    setShowResult(false);
    setAvailablePieces(scenarios[0].command_pieces);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-gray-900 rounded-2xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading scenarios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-gray-900 rounded-2xl p-8 text-center max-w-md">
          <FaTimes className="text-red-500 text-4xl mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Error</h3>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (scenarios.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-gray-900 rounded-2xl p-8 text-center max-w-md">
                     <BiTargetLock className="text-gray-500 text-4xl mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Scenarios Available</h3>
          <p className="text-gray-300 mb-6">No practice scenarios found for {toolName}.</p>
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-gray-900 rounded-2xl p-8 text-center max-w-md">
          <BiBrain className="text-blue-500 text-4xl mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Tool Practice: {toolName}</h3>
          <p className="text-gray-300 mb-6">
            Drag and drop command pieces to build the correct {toolName} command for each scenario.
          </p>
          <div className="text-left text-sm text-gray-400 mb-6">
            <p>• {scenarios.length} scenarios to complete</p>
            <p>• Practice command building skills</p>
            <p>• Learn tool usage patterns</p>
          </div>
          <button
            onClick={startGame}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 mx-auto"
          >
            <FaPlay className="w-4 h-4" />
            Start Practice
          </button>
        </div>
      </div>
    );
  }

  if (gameCompleted) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-gray-900 rounded-2xl p-8 text-center max-w-md">
          <FaTrophy className="text-yellow-500 text-4xl mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Practice Complete!</h3>
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-blue-400 mb-2">{correctAnswers}/{scenarios.length}</div>
            <div className="text-gray-400">Correct Answers</div>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={resetGame}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
            >
              <FaRedo className="w-4 h-4" />
              Play Again
            </button>
            <button
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentScenario = scenarios[currentScenarioIndex];

  return (
         <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
       <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">{toolName} Practice</h2>
            <p className="text-gray-400">Scenario {currentScenarioIndex + 1} of {scenarios.length}</p>
          </div>
                     <div className="flex items-center gap-4">
             <div className="text-center">
               <div className="text-xl font-bold text-blue-400">{correctAnswers}</div>
               <div className="text-xs text-gray-400">Correct</div>
             </div>
             <button
               onClick={onClose}
               className="text-gray-400 hover:text-white active:text-white p-2"
             >
               <FaTimes className="w-6 h-6" />
             </button>
           </div>
        </div>

                 {/* Scenario */}
         <div className="bg-gray-800 rounded-xl p-4 sm:p-6 mb-6">
           <h3 className="text-lg font-semibold text-white mb-2">{currentScenario.scenario_title}</h3>
           <p className="text-gray-300 text-sm sm:text-base">{currentScenario.scenario_description}</p>
           <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-4">
             <div className="flex items-center gap-2 text-sm">
               <BiBrain className="text-blue-400" />
               <span className="text-gray-400">Difficulty:</span>
               <span className={`px-2 py-1 rounded text-xs font-semibold ${
                 currentScenario.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                 currentScenario.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                 'bg-red-500/20 text-red-400'
               }`}>
                 {currentScenario.difficulty}
               </span>
             </div>
             <div className="flex items-center gap-2 text-sm">
               <FaStar className="text-yellow-400" />
               <span className="text-gray-400">Progress:</span>
               <span className="text-white font-semibold">{currentScenarioIndex + 1}/{scenarios.length}</span>
             </div>
           </div>
         </div>

                 {/* Available Command Pieces */}
         <div className="mb-6">
           <h4 className="text-white font-semibold mb-3">
             {isMobile ? 'Tap pieces to add:' : 'Available Pieces:'}
           </h4>
           <div className="flex flex-wrap gap-2">
             {availablePieces.map((piece, index) => (
               <div
                 key={index}
                 draggable={!isMobile}
                 onDragStart={!isMobile ? (e) => handleDragStart(e, index) : undefined}
                 onClick={isMobile ? () => addPieceToCommand(piece, index) : undefined}
                 className={`${
                   isMobile 
                     ? 'bg-blue-600 active:bg-blue-800 cursor-pointer' 
                     : 'bg-blue-600 hover:bg-blue-700 cursor-move'
                 } text-white px-4 py-2 rounded-lg font-mono text-sm transition-colors duration-200`}
               >
                 {piece}
               </div>
             ))}
           </div>
         </div>

                 {/* Command Assembly Area */}
         <div className="mb-6">
           <h4 className="text-white font-semibold mb-3">
             {isMobile ? 'Your command:' : 'Assemble your command:'}
           </h4>
           <div
             className={`min-h-16 bg-gray-800 border-2 border-dashed border-gray-600 rounded-xl p-4 flex flex-wrap gap-2 items-center ${
               !isMobile ? 'cursor-pointer' : ''
             }`}
             onDragEnter={!isMobile ? (e) => handleDragEnter(e, 0) : undefined}
             onDragOver={!isMobile ? handleDragOver : undefined}
             onDrop={!isMobile ? (e) => handleDrop(e, 0) : undefined}
           >
             {currentCommand.length === 0 ? (
               <p className="text-gray-500">
                 {isMobile ? 'Tap pieces above to build your command...' : 'Drag command pieces here...'}
               </p>
             ) : (
               currentCommand.map((piece, index) => (
                 <div
                   key={index}
                   className="bg-green-600 text-white px-4 py-2 rounded-lg font-mono text-sm flex items-center gap-2"
                 >
                   {piece}
                   <button
                     onClick={() => removeFromCommand(index)}
                     className="text-white hover:text-red-300 active:text-red-400"
                   >
                     <FaTimes className="w-3 h-3" />
                   </button>
                 </div>
               ))
             )}
           </div>
         </div>

                 {/* Submit Button */}
         <div className="flex justify-center">
           <button
             onClick={submitAnswer}
             disabled={currentCommand.length === 0}
             className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 active:from-green-700 active:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 disabled:cursor-not-allowed transition-all duration-200"
           >
             <FaCheck className="w-4 h-4" />
             Submit Answer
           </button>
         </div>

                 {/* Result Modal */}
         {showResult && (
           <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
             <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 text-center w-full max-w-md">
              {isCorrect ? (
                <FaCheck className="text-green-500 text-4xl mx-auto mb-4" />
              ) : (
                <FaTimes className="text-red-500 text-4xl mx-auto mb-4" />
              )}
              <h3 className="text-xl font-bold text-white mb-2">
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </h3>
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </div>
                <div className="text-sm text-gray-400">
                  Time: {timeTaken}s
                </div>
              </div>
              {explanation && (
                <div className="bg-gray-800 rounded-lg p-4 mb-4 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <FaInfoCircle className="text-blue-400" />
                    <span className="text-white font-semibold">Explanation:</span>
                  </div>
                  <p className="text-gray-300 text-sm">{explanation}</p>
                </div>
              )}
                             <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                 {!isCorrect && (
                   <button
                     onClick={retryScenario}
                     className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
                   >
                     <FaRedo className="w-4 h-4" />
                     Try Again
                   </button>
                 )}
                 <button
                   onClick={nextScenario}
                   className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white px-6 py-3 rounded-lg transition-colors duration-200"
                 >
                   {currentScenarioIndex + 1 < scenarios.length ? 'Next Scenario' : 'Finish'}
                 </button>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ToolPracticeGame; 