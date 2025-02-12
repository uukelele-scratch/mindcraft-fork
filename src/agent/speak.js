import yargs from 'yargs';
import { exec } from 'child_process';

// Add global unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', {
        promise: promise,
        reason: reason,
        stack: reason?.stack || 'No stack trace'
    });
    process.exit(1);
});

const args = process.argv.slice(2);
if (args.length < 1) {
    console.log('Usage: node speak.js <message>');
    process.exit(1);
}

const argv = yargs(args)
    .option('message', {
        alias: 'm',
        type: 'string',
        description: 'message to speak'
    }).argv;

const textToSpeak = argv.message;
const isWin = process.platform === "win32";
const isMac = process.platform === "darwin"

let command;

if (isWin) {
      command = `powershell -Command "Add-Type –AssemblyName System.Speech; (New-Object System.Speech.Synthesis.SpeechSynthesizer).Speak(\\"${textToSpeak}\\")"`;
} else if (isMac) {
      command = `say "${textToSpeak}"`;
} else {
      command = `espeak "${textToSpeak}"`;
}

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }
  console.log(`Stdout: ${stdout}`);
});
