class Gui {
  constructor() {
    this.items = [];

    this.addItems();
    this.selected = 0;
    
    this.boxPosition = [20, 20];
  }

  render() {
    ctx.globalAlpha = 0.8;
    
    this.boxPosition[0] += (this.items[this.selected].pos[0] - ((this.items[0].size[0] * 1.5 - this.items[0].size[0]) / 2) - this.boxPosition[0]) * 0.2;
    this.boxPosition[1] += (this.items[this.selected].pos[1] - ((this.items[0].size[0] * 1.5 - this.items[0].size[1]) / 2) - this.boxPosition[1]) * 0.2;
    
    ctx.beginPath();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.rect(
      this.boxPosition[0],
      this.boxPosition[1],
      this.items[0].size[0] * 1.5,
      this.items[0].size[0] * 1.5
    );
    ctx.stroke();
    
    this.items.forEach(function(item) {
      item.render();
    });
  }

  addItems() {
    for(var i = 0; i < resources.getLen(); i++) {
      this.items.push(new GuiItem(i + "-gui-item", i, this.items.length));
    }
  }

  leftMouseDown(e) {
    this.items.forEach(function(item) {
      if(item.hover) {
        gui.selected = item.id;
        item.squeezed = true;
        world.entities.unshift(new Sprite(item.id, [input.mouse[0], input.mouse[1], 0], [111, 128], world.numEntities, true));
      }
    });
  }

  leftMouseUp() {
    this.items.forEach(function(item) {
      item.squeezed = false;
    });
  }
}

class GuiItemTemplate {
  constructor() {
    this.size = [70, 70 * (128 / 111)];
    this.scale = 1;

    this.margin = 60;
    this.padding = 30;

    this.squeezed = false;
    this.alpha = 0.7;

    this.rotation = 0;
    this.hover = false;
  }
}

class GuiItem extends GuiItemTemplate {
  constructor(name, url, id) {
    super();

    this.name = name;
    this.texture = resources.get(url);

    this.pos = [
      this.padding + 0,
      this.padding + (this.size[1] + this.margin) * id
    ];

    this.id = id;
  }

  render() {
    if (Utils.insideRect(input.mouse, this.pos, this.size)) {
      this.hover = true;
    } else {
      this.hover = false;
    }
    
    if (this.squeezed && this.hover) {
      this.scale += (0.9 - this.scale) * 0.14;
    } else {
      if (this.hover) {
        this.scale += (1.1 - this.scale) * 0.14;
        this.alpha += (1 - this.alpha) * 0.14;
        this.rotation += (90 - this.rotation) * 0.14;
      } else {
        if (this.scale != 1) {
          this.scale = (this.scale - 1) * 0.8 + 1;
        }
        if (this.alpha != 0.7) {
          this.alpha = (this.alpha - 0.7) * 0.8 + 0.7;
        }
        if(this.rotation !== 0) {
          this.rotation = (this.rotation) * 0.8;
        }
      }
    }
    
    ctx.globalAlpha = this.alpha;
    
    ctx.drawImage(
      this.texture,
      0,
      0,
      this.texture.width,
      this.texture.height,
      this.pos[0] - (this.size[0] * this.scale - this.size[0]) / 2,
      this.pos[1] - (this.size[1] * this.scale - this.size[1]) / 2,
      this.size[0] * this.scale,
      this.size[1] * this.scale
    );
    
    ctx.globalAlpha = 1;
  }
}
