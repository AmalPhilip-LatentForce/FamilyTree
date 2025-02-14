// src/components/FamilyTree/FamilyTree.js
import { FTDataHandler } from "./models/FTDataHandler";
import { FTDrawer } from "./utils/FTDrawer";

// Make sure to define it as a proper class
class FamilyTree extends FTDrawer {
  constructor(data, svg) {
    const ft_datahandler = new FTDataHandler(data);
    super(ft_datahandler, svg);
  }

  get root() {
    return this.ft_datahandler.root;
  }

  draw_data(data) {
    var x0 = null,
      y0 = null;
    if (this.root !== null) {
      [x0, y0] = [this.root.x0, this.root.y0];
    } else {
      [x0, y0] = this.default_root_position();
    }
    this.ft_datahandler = new FTDataHandler(data);
    this.root.x0 = x0;
    this.root.y0 = y0;
    this.clear();
    this.draw();
  }
}

// Export as default
export default FamilyTree;
