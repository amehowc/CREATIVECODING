function importGUIComponents() {
  gui = {};
  const elt = createDiv();
  elt.addClass("gui-container");
  elt.id("gui");
  const container = createDiv();
  container.addClass("gui-item");
  pTitle = createP("Controls");
  pTitle.addClass("title");
  pTitle.parent(container);
  container.parent(elt);
  const canvas = document.getElementById("canvas-container");
  const dom = createButton("Show Controls");
  dom.mousePressed(() => {
    const elt = document.getElementById("gui");
    const btn = document.getElementById("show-controls-button");
    if (window.getComputedStyle(elt).display === "flex") {
      elt.style.display = "none";
      dom.innerhtml = 'Show Controls'
    } else {
      elt.style.display = "flex";
      dom.innerhtml = 'Hide Controls'
    }
  });
  dom.id("show-controls-button");
  dom.addClass("button-elt");
  dom.parent(canvas);

  /* templates
    
    slider = slider(name,[0, 1, 0.5, 0.001],[()=>{}])
    sliders = sliders([name,[0, 1, 0.5, 0.001],[()=>{}]])
    
    */

  slider = (
    name,
    settings = [0, 1, 0.5, 0.001],
    callbacks = {
      event: "changed",
      func: () => {
        console.log(name + " has been changed");
      },
    }
  ) => {
    const elt = document.getElementById("gui");
    if (!gui[name]) {
      const container = createDiv();
      container.addClass("gui-item");
      container.addClass("slider");
      const title = createP(name);
      title.addClass("gui-item-title");
      title.parent(container);
      const dom = createSlider(...settings);
      dom.addClass("slider-elt");
      dom.style("width", "100%");
      dom.parent(title);
      container.parent(elt);
      if (callbacks) {
        if (callbacks.length) {
          callbacks.forEach((callback) => {
            const { event, func } = callback;
            dom[event](func);
          });
        } else {
          const { event, func } = callbacks;
          dom[event](func);
        }
      }
      gui[name] = dom;
    } else {
      throw new Error(
        "Already a GUI item with this name. Use console.log(gui) to figure out what's wrong"
      );
    }
  };

  sliders = (
    nameGroup = "sliders",
    sliderGroup = [
      {
        name: "x",
        settings: [0, 1, 0.5, 0.001],
        callback: () => {
          console.log(sliderGroup[0].name + " has been changed");
        },
      },
      {
        name: "y",
        settings: [0, 1, 0.5, 0.001],
        callback: () => {
          console.log(sliderGroup[1].name + " has been changed");
        },
      },
      {
        name: "z",
        settings: [0, 1, 0.5, 0.001],
        callback: () => {
          console.log(sliderGroup[2].name + " has been changed");
        },
      },
    ]
  ) => {
    const elt = document.getElementById("gui");
    if (!gui[name]) {
      const container = createDiv();
      container.addClass("gui-item");
      container.addClass("sliders");
      const title = createP(nameGroup);
      title.addClass("gui-item-title");
      title.parent(container);
      sliderGroup.forEach((setting, id) => {
        const { name, settings, callback } = setting;
        const title = createP(name);
        title.addClass("gui-item-title");
        const dom = createSlider(...settings);
        dom.addClass("slider-elt");
        dom.style("width", "100%");
        dom.parent(title);
        title.parent(container);
        if (callback) {
          dom.changed(callback);
        }
        
          gui[nameGroup + "-" + name] = dom;
        
      });
      container.parent(elt);
    } else {
      throw new Error(
        "Already a GUI item with this name. Use console.log(gui) to figure out what's wrong"
      );
    }
  };

  button = (
    name,
    innerText = "Press Me",
    callback = () => {
      console.log(name + " is pressed");
    }
  ) => {
    const elt = document.getElementById("gui");
    if (!gui[name]) {
      const container = createDiv();
      container.addClass("gui-item");
      container.addClass("button");
      const title = createP(name);
      title.addClass("gui-item-title");
      const dom = createButton(innerText).mousePressed(callback);
      dom.addClass("button-elt");
      title.parent(container);
      dom.parent(container);
      container.parent(elt);
      gui[name] = dom;
    } else {
      throw new Error(
        "Already a GUI item with this name. Use console.log(gui) to figure out what's wrong"
      );
    }
  };

  buttons = (
    nameGroup = "buttons",
    buttonGroup = [
      {
        name: "play",
        innerText: "⏵︎",
        callback: () => {
          console.log(buttonGroup[0].innerText + " is pressed");
        },
      },
      {
        name: "pause",
        innerText: "⏸︎",
        callback: () => {
          console.log(buttonGroup[1].innerText + " is pressed");
        },
      },
      {
        name: "reset",
        innerText: "⏮︎",
        callback: () => {
          console.log(buttonGroup[2].innerText + " is pressed");
        },
      },
      {
        name: "save",
        innerText: "Save",
        callback: () => {
          console.log(buttonGroup[3].innerText + " is pressed");
        },
      },
    ]
  ) => {
    const elt = document.getElementById("gui");
    if (!gui[name]) {
      const container = createDiv();
      container.addClass("gui-item");
      container.addClass("buttons");
      const title = createP(nameGroup);
      title.parent(container);
      title.addClass("gui-item-title");
      buttonGroup.forEach((settings, id) => {
        const { name, innerText, callback } = settings;
        const dom = createButton(innerText).mousePressed(callback);
        dom.addClass("button-elt");
        dom.parent(container);
        
        gui[nameGroup + "-" + name] = dom;
      });
      container.parent(elt);
    } else {
      throw new Error(
        "Already a GUI item with this name. Use console.log(gui) to figure out what's wrong"
      );
    }
  };

  dropdown = (
    name,
    settings = ["A", "B", "C", "D"],
    callback = () => {
      console.log(name + " is changed");
    }
  ) => {
    const elt = document.getElementById("gui");
    if (!gui[name]) {
      const container = createDiv();
      container.addClass("gui-item");
      container.addClass("dropdown");
      const title = createP(name);
      title.addClass("gui-item-title");
      const dom = createSelect();
      dom.style("min-width", "55%");
      settings.forEach((option) => {
        if (typeof option === "string") {
          dom.option(option);
        } else {
          console.log(`The option ${option} has to be a string`);
        }
        dom.selected(settings[0]);
      });
      dom.addClass("dropdown-elt");
      title.parent(container);
      dom.parent(container);
      container.parent(elt);
      gui[name] = dom;
    } else {
      throw new Error(
        "Already a GUI item with this name. Use console.log(gui) to figure out what's wrong"
      );
    }
  };

  colorpicker = (name, settings = ["#FFF"]) => {
    const elt = document.getElementById("gui");
    if (!gui[name]) {
      const container = createDiv();
      container.addClass("gui-item");
      container.addClass("colorpicker");
      const title = createP(name);
      title.addClass("gui-item-title");
      title.parent(container);
      settings.forEach((setting, id) => {
        const dom = createColorPicker(setting);
        dom.addClass("colorpicker-elt");
        dom.parent(container);
        if (id === 0) {
          gui[name] = dom;
          return;
        }
        gui[name + `${id}`] = dom;
      });
      container.parent(elt);
    } else {
      throw new Error(
        "Already a GUI item with this name. Use console.log(gui) to figure out what's wrong"
      );
    }
  };

  textinput = (name, settings = "hello world!") => {
    const elt = document.getElementById("gui");
    if (!gui[name]) {
      const container = createDiv();
      container.addClass("gui-item");
      container.addClass("textinput");
      const title = createP(name);
      title.addClass("gui-item-title");
      title.parent(container);
      const dom = createInput(settings);
      dom.addClass("textinput-elt");
      dom.parent(container);
      container.parent(elt);
      gui[name] = dom;
    } else {
      throw new Error(
        "Already a GUI item with this name. Use console.log(gui) to figure out what's wrong"
      );
    }
  };

  textarea = (name, settings = "hello world!") => {
    const elt = document.getElementById("gui");
    if (!gui[name]) {
      const container = createDiv();
      container.addClass("gui-item");
      container.addClass("textinput");
      const title = createP(name);
      title.addClass("gui-item-title");
      title.parent(container);
      const dom = createTextArea(settings);
      dom.addClass("textinput-elt");
      dom.parent(container);
      container.parent(elt);
      gui[name] = dom;
    } else {
      throw new Error(
        "Already a GUI item with this name. Use console.log(gui) to figure out what's wrong"
      );
    }
  };

  credits = (name = "google", link = "www.google.com") => {
    const elt = document.getElementById("gui");
    const container = createDiv();
    container.addClass("gui-credits");
    container.id("credits");
    const linkedcredits =
      "credits: " +
      "<a href='arthurcloche.com'target='_blank'>Arthur Cloche</a> & ";
    const innerhtml =
      linkedcredits + "<a href='" + link + "'target='_blank'>" + name + "</a>";
    const title = createP(innerhtml);
    title.addClass("gui-credits-title");
    title.parent(container);
    container.parent(elt);
  };

  function removeImage() {
    if (img) {
      img.remove();
      img = undefined;
    }
    const rmvElt = document.getElementById("remove-button");
    rmvElt.style.visibility = "hidden";
  }

  imageUploadButton = (
    name,
    innerText = "Upload Image",
    callback = (file) => {
      if (file.type === "image") {
        img = createImg(file.data, "");
        img.hide();
        const elt = document.getElementById("remove-button");
        elt.style.visibility = "visible";
        elt.onclick = removeImage;
      } else {
        img = null;
      }
    }
  ) => {
    const elt = document.getElementById("gui");
    if (!gui[name]) {
      const container = createDiv();
      container.addClass("gui-item");
      container.addClass("button");
      const title = createP(name);
      title.addClass("gui-item-title");
      title.parent(container);
      const dom = createFileInput(callback);
      dom.addClass("button-elt");
      dom.addClass("upload-button-elt");
      dom.style("width", "50%");
      const rmv = createButton("remove");
      rmv.id("remove-button");
      rmv.style("visibility", "hidden");
      rmv.addClass('"button-elt"');
      dom.parent(container);
      rmv.parent(container);
      container.parent(elt);
      gui[name] = dom;
    } else {
      throw new Error(
        "Already a GUI item with this name. Use console.log(gui) to figure out what's wrong"
      );
    }
  };
}
