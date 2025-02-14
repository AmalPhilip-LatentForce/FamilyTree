import { FTNode } from "./FTNode";

export class Union extends FTNode {
  constructor(dagNode, ft_datahandler) {
    super(dagNode.id, ft_datahandler.data.unions[dagNode.id]);
    dagNode.ftnode = this;
    this.ft_datahandler = ft_datahandler;
    this._children = dagNode.children;
    this.children = [];
    this._childLinkData = dagNode._childLinkData;
    this.inserted_nodes = [];
    this.inserted_links = [];
    this.visible = false;
  }

  get_neighbors() {
    return this.get_parents().concat(this.get_children());
  }

  get_parents() {
    var parents = this.data.partner
      .map((id) => this.ft_datahandler.find_node_by_id(id))
      .filter((node) => node != undefined);
    if (parents) return parents;
    else return [];
  }

  get_hidden_parents() {
    return this.get_parents().filter((parent) => !parent.visible);
  }

  get_visible_parents() {
    return this.get_parents().filter((parent) => parent.visible);
  }
  get_children() {
    var children = [];
    children = this.children.concat(this._children);
    // sort children by birth year, filter undefined
    children = children.filter((c) => c != undefined);
    // .sort((a, b) => Math.sign((getBirthYear(a) || 0) - (getBirthYear(b) || 0)));
    return children;
  }

  get_hidden_children() {
    return this.get_children().filter((child) => !child.visible);
  }

  get_visible_children() {
    return this.get_children().filter((child) => child.visible);
  }

  show_child(child) {
    if (!this._children.includes(child)) {
      console.warn("Child node not in this' _children array.");
    }
    this.children.push(child);
    this._children.remove(child);
    // if child is already visible, note a connection to destroy it later
    if (child.visible) {
      this.inserted_links.push([this, child]);
    }
    // if child is hidden, show it
    else {
      child.visible = true;
      this.inserted_nodes.push(child);
      // downstream part of the family tree is automatically reconstructed because children attribute
      // is not reset when hiding
    }
  }

  show_parent(parent) {
    if (!parent._children.includes(this)) {
      console.warn("This node not in parent's _children array.");
    }
    parent.children.push(this);
    parent._children.remove(this);
    // if parent is already visible, note a connection to destroy it later
    if (parent.visible) {
      this.inserted_links.push([parent, this]);
    }
    // if parent is hidden, show it
    else {
      parent.visible = true;
      this.inserted_nodes.push(parent);
    }
  }

  show() {
    this.visible = true;

    // show neighboring children
    this.get_children().forEach((child) => {
      this.show_child(child);
    });

    // show neighboring parents
    this.get_parents().forEach((parent) => {
      this.show_parent(parent);
    });
  }

  get_visible_inserted_children() {
    return this.children.filter((child) => this.inserted_nodes.includes(child));
  }

  get_visible_inserted_parents() {
    return this.get_visible_parents().filter((parent) =>
      this.inserted_nodes.includes(parent)
    );
  }

  is_root() {
    return false;
  }

  hide_child(child) {
    if (!this.children.includes(child)) {
      console.warn("Child node not in this's children array.");
    }
    child.visible = false;
    this._children.push(child);
    this.children.remove(child);
    this.inserted_nodes.remove(child);
  }

  hide_parent(parent) {
    if (!parent.children.includes(this)) {
      console.warn("This node not in parent's children array.");
    }
    parent.visible = false;
    parent._children.push(this);
    parent.children.remove(this);
    this.inserted_nodes.remove(parent);
  }

  hide() {
    this.visible = false;

    // hide neighboring children, if inserted by this node
    this.get_visible_inserted_children().forEach((child) => {
      this.hide_child(child);
    });

    // hide neighboring parents, if inserted by this node
    this.get_visible_inserted_parents().forEach((parent) => {
      this.hide_parent(parent);
    });

    // hide only edge (not node) if not inserted by this node
    this.inserted_links.forEach((edge) => {
      const source = edge[0];
      const target = edge[1];
      if (this == source) {
        this._children.push(target);
        this.children.remove(target);
      } else if (this == target) {
        source._children.push(this);
        source.children.remove(this);
      }
    });
    this.inserted_links = [];
  }

  get_own_unions() {
    return [];
  }

  get_parent_unions() {
    return [];
  }

  get_name() {
    return undefined;
  }

  get_birth_year() {
    return undefined;
  }

  get_birth_place() {
    return undefined;
  }

  get_death_year() {
    return undefined;
  }

  get_death_place() {
    return undefined;
  }

  is_union() {
    return true;
  }

  add_parent(person_data) {
    // make person object
    const id = person_data.id || "p" + ++this.ft_datahandler.number_nodes;
    const dagNode = new d3.dagNode(id, person_data);
    const person = new Person(dagNode, this.ft_datahandler);
    if (!("parent_union" in person_data)) person_data.parent_union = undefined;
    if (!("own_unions" in person_data)) {
      person_data.own_unions = [this.id];
      person._childLinkData = [[person.id, this.id]];
      person._children.push(this);
    }
    person.data = person_data;
    this.ft_datahandler.nodes.push(person);
    // make sure person lists this union as an own union
    if (!person_data.own_unions.includes(this.id))
      person_data.own_unions.push(this.id);
    // make sure this union lists person as parent
    if (!this.data.partner.includes(person.id))
      this.data.partner.push(person.id);
    // make union visible
    this.show_parent(person);
    this.ft_datahandler.update_roots();
    return person;
  }

  add_child(person_data) {
    // make person object
    const id = person_data.id || "p" + ++this.ft_datahandler.number_nodes;
    const dagNode = new d3.dagNode(id, person_data);
    const person = new Person(dagNode, this.ft_datahandler);
    if (!("parent_union" in person_data)) person_data.parent_union = this.id;
    if (!("own_unions" in person_data)) person_data.own_unions = [];
    person.data = person_data;
    this.ft_datahandler.nodes.push(person);
    // make sure person lists this union as an parent union
    if (!person_data.parent_union == this.id)
      person_data.parent_union == this.id;
    // make sure this union lists person as child
    if (!this.data.children.includes(person.id))
      this.data.children.push(person.id);
    if (!this._childLinkData.includes([this.id, person.id]))
      this._childLinkData.push([this.id, person.id]);
    // make union visible
    this.show_child(person);
    return person;
  }
}
