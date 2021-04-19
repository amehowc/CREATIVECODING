type TrackInput = {
  name: string
  mode?: 'normal' | 'frames'
  keyframes: number[]
  bounce: boolean
}

type TriggerInput = {
  name: string
  mode?: 'normal' | 'frames'
  keyframes: number[]
  kind?: 'bip' | 'step'
}

type TrackKeyframes = {
  name: string
  keyframes: number[]
}

type TriggerKeyframes = {
  name: string
  keyframes: boolean[]
}

// used to send out values
type TimelineOut = {
  tracks: TrackKeyframes[] = []
  triggers: TriggerKeyframes[] = []
}

//used to send in values to make retiming easier
type TimelineIn = {
  tracks: TrackInput[]
  triggers: TriggerInput[]
}

const defaultTrack: TrackInput = {
  name: 'Default',
  mode: 'normal',
  keyframes: [],
  bounce: false,
}

const defaultTrigger: TriggerInput = {
  name: 'Default',
  mode: 'normal',
  keyframes: [],
  kind: 'bip',
}


class Timeline {
  private numFrames: number
  private time : number = 0
  private tracks: [string, Track][] = []
  private triggers: [string, Trigger][] = []
  private memoryStack: TimelineIn = {
    tracks: [],
    triggers: [],
  }

  constructor(_numFrames: number) {
    this.numFrames = _numFrames
  }

  run(_speed: number = 1) {

    for (let trigger of this.triggers) {
      const [name, values] = trigger
      values.evaluateValueAt(this.time);
    }

    for (let track of this.tracks) {
      const [name, values] = track
      values.evaluateStateAt(this.time);
    }
    this.time = (this.time + _speed) % this.numFrames;

  }

  getNumFrames() {
    return this.numFrames
  }

  getTimeline() {
    const timeline: TimelineOut = {
      tracks: [],
      triggers: []
    }

    for (const [name, trigger] of this.triggers) {
      timeline.triggers.push({ name, keyframes: trigger.getValues() })
    }

    for (const [name, track] of this.tracks) {
      timeline.tracks.push({ name, keyframes: track.getValues() })
    }

    return timeline
  }

  addTracks(_tracks: TrackInput[] = [defaultTrack]) {

    this.memoryStack.triggers = _tracks;
    for (const track of _tracks) {
      const t = new Track(track, this)
      this.tracks.push([track.name, t])
    }
  }

  addTriggers(_trigger: TrackInput[] = [defaultTrack]) {

    this.memoryStack.triggers = _trigger;
    for (const trigger of _trigger) {
      const t = new Trigger(trigger, this)
      this.triggers.push([trigger.name, t])
    }
  }

  retime(_numFrames: number = this.numFrames){
      if(_numFrames == this.numFrames){
       console.log('no change has been done')
      }
      if(this.memoryStack.tracks.length == 0){
         console.log('no tracks in memory')

      } else {
        this.numFrames = _numFrames;
        this.tracks = [];
        this.memoryStack.tracks.forEach((track) => {
        const t = new Track(track, this.parent)
        this.tracks.push([str(track.name), t])
        })
      }

      if(this.memoryStack.triggers.length == 0){
        console.log('no triggers in memory')
      } else {
        this.numFrames = _numFrames;
        this.triggers = [];
        this.memoryStack.triggers.forEach((trigger) => {
        const t = new Trigger(trigger, this.parent)
        this.triggers.push([str(trigger.name), t])
        })
      }
  }
}

class Track {
  private parent: Timeline
  private values: number[] = []
  private mode: 'frames' | 'normal'
  private bounce: boolean
  private keyframes: [number, number][]

  constructor(_settings, _parent) {
    this.parent = _parent
    this.mode = _settings.mode ?? 'normal'
    this.bounce = _settings.bounce
    this.keyframes = this.createKeyframesPair(_settings.keyframes)
  }

  private createKeyframesPair(_keyframes) {
    const keys: number[] = []
    const keyframes: [number, number][] = []
    if (_keyframes.length == 0) {
      keyframes.push([0, this.parent.getNumFrames()])
      return keyframes
    } else {
      if (this.mode == 'normal') {
        _keyframes.forEach((_key) => {
          keys.push(Math.round(_key * this.parent.getNumFrames()))
        })
      } else {
        keys.push(..._keyframes)
      }
      keyframes.push([0, keys[0]])
      if (keys.length > 1) {
        for (let i = 0; i < keys.length - 1; i++) {
          keyframes.push([keys[i], keys[i + 1]])
        }
      }
      keyframes.push([keys[keys.length - 1], this.parent.getNumFrames()])
      return keyframes
    }
  }

  evaluateStateAt(_time: number) {
    for (let i = 0; i < this.keyframes.length; i++) {
      const [begin, end] = this.keyframes[i]
      this.values[i] = this.linearstep(_time, begin, end)
    }
  }

  getValues() {
    return this.values
  }

  private linearstep(t: number, begin: number, end: number) {
    return Math.max(Math.min((t - begin) / (end - begin), 1), 0)
  }
}

class Trigger {

  private parent: Timeline
  private values: boolean[] = []
  private mode: 'frames' | 'normal'
  private kind: 'bip' | 'step'
  private keyframes: [number][]

  constructor(_settings, _parent) {
    this.parent = _parent
    this.mode = _settings.mode ?? 'normal'
    this.kind = _settings.kind ?? 'bip'
    this.keyframes = this.createKeyframesAtTime(_settings.keyframes)
  }

  private createKeyframesAtTime(_keyframes){
    const keyframes: number[] = []
    if (_keyframes.length == 0) {
      keyframes.push([0, this.parent.getNumFrames()])
      return keyframes
    } else {
      if (this.mode == 'normal') {
        _keyframes.forEach((_key: number) => {
          keyframes.push(Math.round(_key * this.parent.getNumFrames()))
        })
      } else {
        keyframes.push(..._keyframes)
      }
      return keyframes
    }

  private evaluateValueAt(_time : number){
      this.keyframes.forEach((keyframe, index) => {
        if (_time == 0){
        this.values[index] = false;
        }
        if (_time == keyframe) {
          this.values[index] = true
        } else {
          this.values[index] = false;
          }
      })
    }

    getValues() {
      return this.values
    }

}
