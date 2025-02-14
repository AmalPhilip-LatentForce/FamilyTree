export class FTDataHandler {
  constructor(data, start_node_id = data.start) {
    this.data = data;

    if (data.links.length > 0) {
      this.dag = window.d3.dagConnect()(data.links);

      if (this.dag.id != undefined) {
        this.root = this.dag.copy();
        this.root.id = undefined;
        this.root.children = [this.dag];
        this.dag = this.root;
      }

      this.nodes = this.dag.descendants().map((node) => {
        if (node.id in data.unions) return new Union(node, this);
        else if (node.id in data.persons) return new Person(node, this);
      });

      this.nodes.forEach(
        (n) => (n._children = n._children.map((c) => c.ftnode))
      );

      this.number_nodes = 0;
      this.nodes.forEach((node) => {
        node.id = node.id || this.number_nodes;
        this.number_nodes++;
      });

      this.root = this.find_node_by_id(start_node_id);
      this.root.visible = true;
      this.dag.children = [this.root];
    } else if (Object.keys(data.persons).length > 0) {
      const root_data = data.persons[start_node_id];
      this.root = new window.d3.dagNode(start_node_id, root_data);
      this.root = new Person(this.root, this);
      this.root.visible = true;
      this.number_nodes = 1;
      this.nodes = [this.root];

      this.dag = new window.d3.dagNode(undefined, {});
      this.dag.children = this.root;
    }
  }

  update_roots() {
    this.dag.children = [this.root];
    const FT = this;

    function find_roots_recursive(node) {
      node.get_visible_inserted_neighbors().forEach((node) => {
        if (node.is_root()) FT.dag.children.push(node);
        find_roots_recursive(node);
      });
    }
    find_roots_recursive(this.root);
  }

  find_node_by_id(id) {
    return this.nodes.find((node) => node.id == id);
  }
}
