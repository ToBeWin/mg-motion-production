import Foundation
import AVFoundation
import AudioToolbox

struct Note: Decodable { let time: Double; let duration: Double; let note: UInt8; let velocity: UInt8; let instrument: String }
struct Event { let frame: Int64; let note: UInt8; let velocity: UInt8; let on: Bool }
let args = CommandLine.arguments
guard args.count == 6 else { fatalError("usage: render_instrument notes.json instrument program out.wav duration") }
let notes = try JSONDecoder().decode([Note].self, from: Data(contentsOf: URL(fileURLWithPath: args[1])))
let instrument = args[2], program = UInt8(args[3])!, output = URL(fileURLWithPath: args[4]), duration = Double(args[5])!
let rate = 48000.0
let engine = AVAudioEngine(), sampler = AVAudioUnitSampler()
engine.attach(sampler)
let format = AVAudioFormat(standardFormatWithSampleRate: rate, channels: 2)!
engine.connect(sampler, to: engine.mainMixerNode, format: format)
let bank = URL(fileURLWithPath: "/System/Library/Components/CoreAudio.component/Contents/Resources/gs_instruments.dls")
try sampler.loadSoundBankInstrument(at: bank, program: program, bankMSB: UInt8(kAUSampler_DefaultMelodicBankMSB), bankLSB: 0)
try engine.enableManualRenderingMode(.offline, format: format, maximumFrameCount: 1024)
try engine.start()
var events: [Event] = []
for n in notes where n.instrument == instrument {
 events.append(Event(frame: Int64((n.time*rate).rounded()), note:n.note, velocity:n.velocity, on:true))
 events.append(Event(frame: Int64(((n.time+n.duration)*rate).rounded()), note:n.note, velocity:0, on:false))
}
events.sort { $0.frame == $1.frame ? (!$0.on && $1.on) : $0.frame < $1.frame }
let file = try AVAudioFile(forWriting: output, settings: format.settings)
let buffer = AVAudioPCMBuffer(pcmFormat: engine.manualRenderingFormat, frameCapacity: 1024)!
let total = Int64((duration*rate).rounded())
var cursor: Int64 = 0, index = 0, retries = 0
while cursor < total {
 while index < events.count && events[index].frame <= cursor {
  let e=events[index]
  if e.on { sampler.startNote(e.note, withVelocity:e.velocity, onChannel:0) } else { sampler.stopNote(e.note, onChannel:0) }
  index += 1
 }
 let next = index < events.count ? events[index].frame : total
 let frames = AVAudioFrameCount(min(1024, min(total-cursor, max(1,next-cursor))))
 let status = try engine.renderOffline(frames, to:buffer)
 switch status {
 case .success: try file.write(from:buffer); cursor += Int64(buffer.frameLength); retries=0
 case .cannotDoInCurrentContext: retries += 1; if retries > 1000 { fatalError("offline render stalled") }
 default: fatalError("offline render failed: \(status)")
 }
}
engine.stop()
print("Rendered \(instrument): \(cursor) frames to \(output.path)")
