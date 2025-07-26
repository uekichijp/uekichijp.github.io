import { Midi } from 'https://cdn.skypack.dev/@tonejs/midi';

let expectedPattern = [];

document.getElementById('midiFileInput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  const arrayBuffer = await file.arrayBuffer();
  const midi = new Midi(arrayBuffer);

  expectedPattern = [];
  midi.tracks.forEach(track => {
    track.notes.forEach(note => {
      const time = Math.round(note.time * 4) / 4; // 16分音符単位で丸める
      const index = Math.round(time / 0.25);
      if (!expectedPattern[index]) expectedPattern[index] = [];
      expectedPattern[index].push(note.midi);
    });
  });

  expectedPattern = expectedPattern.map(arr => arr ? arr.sort((a, b) => a - b) : []);
  document.getElementById('output').textContent =
    '期待パターン: \n' + JSON.stringify(expectedPattern, null, 2);
});

document.getElementById('simulateDrum').addEventListener('click', () => {
  const userPlayed = [
    [49, 36],
    [42],
    [38, 42],
    [42],
    [42, 36],
    [42, 36],
    [38, 42],
    [42],
    [42, 36],
    [42],
    [38, 42],
    [42],
    [42, 36],
    [42, 36],
    [38, 42],
    [42],
  ];

  let match = true;
  for (let i = 0; i < expectedPattern.length; i++) {
    const a = (expectedPattern[i] || []).join(',');
    const b = (userPlayed[i] || []).join(',');
    if (a !== b) {
      match = false;
      break;
    }
  }

  document.getElementById('output').textContent += '\n\n判定結果: ' + (match ? '🎯 Great!' : '❌ Try Again');
});
