function Timeline(_numFrames) {
  this.numFrames = _numFrames;
  this.time = 0;
  this.tracks = [];
  this.triggers = [];
  this.parent = this;
  this.memoryStack = {
    tracks: [],
    triggers: []
  }

  this.run = (_speed) => {
    if (!_speed) {
      _speed = 1
    }

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

  this.getTimeline = () => {
    let timeline = {
      tracks : [],
      triggers : []
    }

    for (let trigger of this.triggers) {
      const [name, keyframes] = trigger
      timeline.triggers.push({
        name,
        keyframes: keyframes.values
      });
    }

    for (let track of this.tracks) {
      const [name, keyframes] = track
      timeline.tracks.push({
        name,
        keyframes: keyframes.values
      });
    }
    return timeline;

  }

this.retime = (_numFrames) =>{
    if(_numFrames == this.numFrames){
    return
    }
    this.numFrames = _numFrames;
    this.tracks = [];
    this.triggers = [];
    if(this.memoryStack.tracks.length !=0){
      this.memoryStack.tracks.forEach((track) => {
      const t = new Track(track, this.parent)
      this.tracks.push([str(track.name), t])
    })
    }
    if(this.memoryStack.triggers.length !=0){
    this.memoryStack.triggers.forEach((trigger) => {
    const t = new Trigger(trigger, this.parent)
    this.triggers.push([str(trigger.name), t])
  })
    }

}

this.addTriggers = (_triggers) => {
  let triggers;
  if (_triggers) {
    triggers = _triggers;
  } else {
    triggers = [{
      name: 'Default',
      mode: 'normal',
      keyframes: [],
      // kind: 'bip',
    }]
  }
  this.memoryStack.triggers = triggers;

  triggers.forEach((trigger) => {
    const t = new Trigger(trigger, this.parent)
    this.triggers.push([str(trigger.name), t])
  })
}

this.addTracks = (_tracks) => {
  let tracks;
  if (_tracks) {
    //TO DO : validate parameters else fill missing spots with default values
    tracks = _tracks;
  } else {
    tracks = [{
      name: 'Default',
      mode: 'normal',
      keyframes: [],
    }]
  }

  this.memoryStack.tracks = tracks;

  tracks.forEach((track) => {
    const t = new Track(track, this.parent)
    this.tracks.push([str(track.name), t])
  })



}
}

function Trigger(_settings, _parent) {
  this.parent = _parent;
  this.mode = _settings.mode == undefined ? 'normal' : _settings.mode;
  this.kind = _settings.kind == undefined ? 'bip' : _settings.kind;
  this.values = [];

  this.createKeyframesAtTime = (_keyframes) => {
    let keyframes = []
    if (_keyframes.length == 0) {
      keyframes.push([0, this.parent.numFrames])
      return keyframes
    } else {
      if (this.mode == 'normal') {
        _keyframes.forEach((_key) => {
          keyframes.push(round(_key * this.parent.numFrames))
        })
      } else {
        keyframes = _keyframes;
      }
      return keyframes
    }
  }
    this.evaluateValueAt = (_time) => {
      this.keyframes.forEach((keyframe,index) => {
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

    this.keyframes = this.createKeyframesAtTime(_settings.keyframes);

  }




function Track(_settings, _parent) {
  this.parent = _parent;
  this.values = [];
  this.mode = _settings.mode == undefined ? 'frames' : _settings.mode;
  //TO DO : Add bounce back
  this.bounce = _settings.bounce;

  this.createKeyframesPair = (_keyframes) => {
    let keys = []
    let keyframes = []
    if (_keyframes.length == 0) {
      keyframes.push([0, this.parent.numFrames])
      return keyframes
    } else {
      if (this.mode == 'normal') {
        _keyframes.forEach((_key) => {
          keys.push(round(_key * this.parent.numFrames))
        })
      } else {
        keys = _keyframes;
      }
      keyframes.push([0, keys[0]])
      if (keys.length > 1) {
        for (let i = 0; i < keys.length - 1; i++) {
          keyframes.push([keys[i], keys[i + 1]])
        }
      }
      keyframes.push([keys[keys.length - 1], this.parent.numFrames])
      return keyframes
    }
  }

  this.keyframes = this.createKeyframesPair(_settings.keyframes);

  this.evaluateStateAt = (_time) => {
    for (let i = 0; i < this.keyframes.length; i++) {
      const pairs = this.keyframes[i]
      this.values[i] = this.linearstep(_time, pairs[0], pairs[1])
    }
  }

  this.linearstep = (t, begin, end) => {
    return constrain((t - begin) / (end - begin), 0, 1);
  }
}
