import React, { useRef, useEffect, useState } from "react";
import useAudioContext from "../use-audio-context";
import useInterval from "../use-interval";
import "../styles.css";
import Waveform, { WaveformGradient } from "../waveform";
import createWaveform from "../create-waveform";
import ml5 from "ml5";

const scale = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
let arrayOfPlayedNotes = [];
let lastPLayedNote;
let currentVolume = 0;
function freqToMidi(f) {
    if (!f) {
        return;
    }
    var mathlog2 = Math.log(f / 440) / Math.log(2);
    var m = Math.round(12 * mathlog2) + 69;
    return m;
}

const midiToNote = (midiNum) => {
    const note = scale[midiNum % 12];
    getNoteAndSaveToArray(note);
    return note;
}

const getNoteAndSaveToArray = (note) => {
    if(checkIfNoteStillSounding(note) && currentVolume >= 15) {
        arrayOfPlayedNotes.push(note);
    }
}

const checkIfNoteStillSounding = (note) => {
    if (arrayOfPlayedNotes.length === 0 || !lastPLayedNote) {
        setLastPlayedNote(note);
        return true;
    }
    const areNotesDifferent = lastPLayedNote !== note;

    if (areNotesDifferent) {
        setLastPlayedNote(note);
    }
    return areNotesDifferent;
}

const setLastPlayedNote = (note) => {
    lastPLayedNote = note;
}
const freqToNote = frequency => midiToNote(freqToMidi(frequency));
const modeWithConfidence = (arr, limit) => {
    var numMapping = {};
    var greatestFreq = 0;
    var mode;
    for (const number of arr) {
        numMapping[number] = (numMapping[number] || 0) + 1;

        if (greatestFreq < numMapping[number]) {
            greatestFreq = numMapping[number];
            mode = number;
        }
    }

    let modalMisses = 0;
    for (const [key, frequency] of Object.entries(numMapping)) {
        if (Number(key) !== mode) {
            modalMisses += frequency;
        }
    }
    return { mode, greatestFreq, modalMisses };
};

export default function PitchDetector({volume, setRecordedNotesArray, recordedNotesArray}) {
    const audioContextRef = useAudioContext();
    const audioElementRef = useRef();
    const pitchDetectorRef = useRef();
    const [audioData, setAudioData] = useState(null);
    const [waveform, setWaveform] = useState(null);
    const [frequencies, setFrequencies] = useState([]);

    useEffect(() => {
        if (currentVolume !== volume) {
            currentVolume = volume;
        }
        if(recordedNotesArray.length === 0) {
            arrayOfPlayedNotes = [];
        }
        console.log(arrayOfPlayedNotes);
        if(recordedNotesArray !== arrayOfPlayedNotes) {
            setRecordedNotesArray(arrayOfPlayedNotes);
        }
    }, [volume]);
    useEffect(() => {
        return;
        if (!audioContextRef.current) {
            return;
        }
        (async () => {
            const response = await fetch("/88-keys.m4a");
            const buffer = await response.arrayBuffer();
            const audio = await audioContextRef.current.decodeAudioData(buffer);
            setAudioData(audio);
        })();
    }, [audioContextRef.current]);

    const [modelLoaded, setModelLoaded] = useState(false);
    useEffect(() => {
        return;
        if (!audioData) {
            return;
        }
        setWaveform(createWaveform(audioData, audioData.length / 1000));
    }, [audioData]);

    useEffect(() => {
        return;
        if (!audioElementRef) {
            return;
        }
        function updatePlayHead() {}
        audioElementRef.current.addEventListener("timeupdate", updatePlayHead);
        pitchDetectorRef.current = ml5.pitchDetection(
            "/models/pitch-detection/crepe",
            audioContextRef.current,
            audioElementRef.current.captureStream(),
            () => setModelLoaded(true)
        );
        return () => {
            audioElementRef.current.removeEventListener("timeupdate", updatePlayHead);
        };
    }, [audioElementRef.current]);
    useEffect(() => {
        (async () => {
            const micStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false
            });
            pitchDetectorRef.current = ml5.pitchDetection(
                "/models/pitch-detection/crepe",
                audioContextRef.current,
                micStream,
                () => setModelLoaded(true)
            );
        })();
    }, []);
    useInterval(() => {
        if (!pitchDetectorRef.current) {
            return;
        }
        pitchDetectorRef.current.getPitch((err, detectedPitch) => {
            if (frequencies.length < 10) {
                setFrequencies([...frequencies, detectedPitch]);
            } else if (frequencies.length >= 10) {
                setFrequencies([...frequencies.slice(1), detectedPitch]);
            }
        });
    }, 1000 / 30);
    const midis = frequencies.map(freqToMidi).filter(midiNum => !!midiNum);
    const { mode: modalMidi, greatestFreq, modalMisses } = modeWithConfidence(
        midis,
        10
    );
    const confidence = (greatestFreq - 3) / Math.max(modalMisses, 1);
    return (
        <div className="App">
            {/*
            <div>
                <code>{JSON.stringify(frequencies)}</code>
            </div>
            <div>
                <code>{JSON.stringify(midis)}</code>
            </div>
            */}
            {modalMidi && confidence > 0.5 && (
                <>
                    <p style={{display: 'none'}}>{midiToNote(modalMidi)}</p>
                        {/*    <p>MIDI: {modalMidi}</p>
                    <p>CONF: {confidence.toFixed(2)}</p>
                    <p>FREQ: {greatestFreq}</p>
                    <p>MISS: {modalMisses}</p>*/}
                </>
            )}
            {/*waveform && (
                <>
                    <div style={{ height: "154px", background: "#22a3ef" }}>
                        <Waveform waveform={waveform} />
                        <WaveformGradient />
                    </div>
                </>
            )*/}
        </div>
    );
}
