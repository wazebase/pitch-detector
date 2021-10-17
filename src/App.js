import React, {useState}  from "react";
import { RecordState } from 'audio-react-recorder'
import TeachersPage from "./pages/TeachersPage";
import StudentPage from "./pages/StudentPage";
import DashboardPage from "./pages/DashboardPage";
import Navigation from "./components/Navigation";

export default function App() {
  const [showDetector, setShowDetector] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [volume, setVolume] = useState(0);
  const [recordState, setRecordState] = useState(null);
  const [recordStore, setRecordStore] = useState([]);
  const [accuracy, setAccuracy] = useState(0);
  const [recordedNotesArray, setRecordedNotesArray] = useState([]);
  const [isTeachersPage, setIsTeachersPage] = useState(false);
  const [isStudentPage, setIsStudentPage] = useState(false);
  const [isDashboardPage, setIsDashboardPage] = useState(true);
  const [taskIndex, setTaskIndex] = useState(0);
  const [taskInformation, setTaskInformation] = useState({
      title: 'Task 1',
      type: 'arpeggios',
  });
    const openStudentPage = () => {
        setIsStudentPage(true);
        setIsTeachersPage(false);
        setIsDashboardPage(false);
    }

    const openTeachersPage = () => {
        setIsStudentPage(false);
        setIsTeachersPage(true);
        setIsDashboardPage(false);
    }

    const openDashboardPage = () => {
        setIsStudentPage(false);
        setIsTeachersPage(false);
        setIsDashboardPage(true);
    }

  const startRecording = () => {
      setRecordState(RecordState.START);
  }

  const stopRecording = () => {
      setRecordState(RecordState.STOP);
  }

  const startSession = () => {
      setRecordedNotesArray([]);
      startRecording();
      captureMicrophoneVolume();
      setShowResult(false);
      setShowDetector(true);
  }

  const endTeacherSession = () => {
      stopRecording();
      setShowDetector(!showDetector);
      setTimeout(()=> openDashboardPage(), 300);
  }

  const endStudentSession = () => {
      stopRecording();
  }

   const onStop = (audioData) => {
        if (isTeachersPage) {
            recordStore.push({notesArray: [...recordedNotesArray], audioUrl: audioData.url, ...taskInformation});
        }
        if (isStudentPage) {
            setShowResult(true);
            setShowDetector(!showDetector);
            getAccuracy();
        }
    }

    const getAccuracy = () => {
        let mistakesNumber = 0;
        const teachersNotesArray = recordStore[taskIndex].notesArray;
        const studentNotesArray = recordedNotesArray.slice(0, teachersNotesArray.length);
        console.log(teachersNotesArray, studentNotesArray);
        teachersNotesArray.forEach((note, i) => {
            if (note !== studentNotesArray[i]) {
                mistakesNumber += 1;
            }
        })
        const accuracy =
            Math.round(((recordedNotesArray.length - mistakesNumber) / recordedNotesArray.length) * 100);
        setAccuracy(accuracy);
    }
    const captureMicrophoneVolume = () => {
      navigator.mediaDevices.getUserMedia({ audio: true, video: false})
          .then(function(stream) {
              let audioContext = new AudioContext();
              let analyser = audioContext.createAnalyser();
              let microphone = audioContext.createMediaStreamSource(stream);
              let javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

              analyser.smoothingTimeConstant = 0.8;
              analyser.fftSize = 1024;

              microphone.connect(analyser);
              analyser.connect(javascriptNode);
              javascriptNode.connect(audioContext.destination);
              javascriptNode.onaudioprocess = function() {
                  var array = new Uint8Array(analyser.frequencyBinCount);
                  analyser.getByteFrequencyData(array);
                  var values = 0;

                  var length = array.length;
                  for (var i = 0; i < length; i++) {
                      values += (array[i]);
                  }

                  var average = values / length;

                  setVolume(Math.round(average));
                  // colorPids(average);
              }
          })
          .catch(function(err) {
              /* handle the error */
          });
  }
  return (
    <div className="app-container">
        <Navigation openDashboardPage={openDashboardPage}
                    openTeachersPage={openTeachersPage}
                    openStudentPage={openStudentPage}
        />
        {isDashboardPage && <DashboardPage
            recordStore={recordStore}
            setTaskIndex={setTaskIndex}
            setRecordedNotesArray = {setRecordedNotesArray}
            openTeachersPage={openTeachersPage}
            openStudentPage={openStudentPage}/>}
        {isTeachersPage && <TeachersPage
            taskInformation={taskInformation}
            setTaskInformation={setTaskInformation}
                startRecording={startRecording}
               stopRecording={stopRecording}
                startSession={startSession}
                endSession={endTeacherSession}
                onStop={onStop}
                captureMicrophoneVolume={captureMicrophoneVolume}
                volume={volume}
                setVolume={setVolume}
                showDetector={showDetector}
                setShowDetector={setShowDetector}
                recordState={recordState}
                setRecordState={setRecordState}
                recordedNotesArray={recordedNotesArray}
                setRecordedNotesArray={setRecordedNotesArray} />}
        {isStudentPage && <StudentPage
            task={recordStore[taskIndex]}
            startRecording={startRecording}
            stopRecording={stopRecording}
            startSession={startSession}
            endSession={endStudentSession}
            onStop={onStop}
            showResult={showResult}
            captureMicrophoneVolume={captureMicrophoneVolume}
            volume={volume}
            setVolume={setVolume}
            accuracy = {accuracy}
            showDetector={showDetector}
            setShowDetector={setShowDetector}
            recordState={recordState}
            setRecordState={setRecordState}
            recordedNotesArray={recordedNotesArray}
            setRecordedNotesArray={setRecordedNotesArray} />}
    </div>
  );
}
