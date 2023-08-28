export const checkboxComponent = (
    name,
    innerText = "Check This",
    settings = false,
    callback = () => {
        //console.log(name + " is pressed");
    }
) => {
    const elt = document.getElementById("gui");
    if (!gui[name]) {
        const container = p5.createDiv();
        container.addClass("gui-item");
        container.addClass("checkbox");
        const title = p5.createP(innerText);
        title.addClass("gui-item-title");
        title.parent(container);
        const dom = p5.createCheckbox('',settings).changed(callback);
        dom.addClass("checkbox-elt");
        dom.parent(title);
        container.parent(elt);
        gui[name] = dom;
    } else {
        throw new Error(
            "Already a GUI item with this name. Use console.log(gui) to figure out what's wrong"
        );
    }
};
