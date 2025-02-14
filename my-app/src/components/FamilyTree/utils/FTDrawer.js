export class FTDrawer {
  static label_delimiter = "_";

  constructor(ft_datahandler, svg, x0, y0) {
    this.ft_datahandler = ft_datahandler;
    this.svg = svg;
    this._orientation = null;
    this.link_css_class = "link";

    // Initialize base drawing setup
    this.g = this.svg.append("g");

    // Initialize zoom behavior
    this.zoom = window.d3
      .zoom()
      .on("zoom", (event) => this.g.attr("transform", event.transform));
    this.svg.call(this.zoom);

    // initialize tooltips
    this._tooltip_div = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("visibility", "hidden");
    this.tooltip(FTDrawer.default_tooltip_func);

    // initialize dag layout maker
    this.layout = d3
      .sugiyama()
      .nodeSize([120, 120])
      .layering(d3.layeringSimplex())
      .decross(d3.decrossOpt)
      .coord(d3.coordVert());

    // defaults
    this.orientation("horizontal");
    this.transition_duration(750);
    this.link_path(FTDrawer.default_link_path_func);
    this.node_label(FTDrawer.default_node_label_func);
    this.node_size(FTDrawer.default_node_size_func);
    this.node_class(FTDrawer.default_node_class_func);

    // set starting position for root node
    const default_pos = this.default_root_position();
    this.ft_datahandler.root.x0 = x0 || default_pos[0];
    this.ft_datahandler.root.y0 = y0 || default_pos[1];
  }

  default_root_position() {
    return [this.svg.attr("width") / 2, this.svg.attr("height") / 2];
  }

  orientation(value) {
    // getter/setter for tree orientation (horizontal/vertical)
    if (!value) return this.orientation;
    else {
      this._orientation = value;
      return this;
    }
  }

  node_separation(value) {
    // getter/setter for separation of nodes in x and y direction (see d3-dag documentation)
    if (!value) return this.layout.nodeSize();
    else {
      this.layout.nodeSize(value);
      return this;
    }
  }

  layering(value) {
    // getter/setter for layout operator (see d3-dag documentation)
    if (!value) return this.layout.layering();
    else {
      this.layout.layering(value);
      return this;
    }
  }

  decross(value) {
    // getter/setter for descross operator (see d3-dag documentation)
    if (!value) return this.layout.decross();
    else {
      this.layout.decross(value);
      return this;
    }
  }

  coord(value) {
    // getter/setter for coordinate operator (see d3-dag documentation)
    if (!value) return this.layout.coord();
    else {
      this.layout.coord(value);
      return this;
    }
  }

  transition_duration(value) {
    // getter/setter for animation transition duration
    if ((value != 0) & !value) return this._transition_duration;
    else {
      this._transition_duration = value;
      return this;
    }
  }

  static default_tooltip_func(node) {
    if (node.is_union()) return;
    var content =
      `
                      <span style='margin-left: 2.5px;'><b>` +
      node.get_name() +
      `</b></span><br>
                      <table style="margin-top: 2.5px;">
                              <tr><td>born</td><td>` +
      (node.get_birth_year() || "?") +
      ` in ` +
      (node.data.birthplace || "?") +
      `</td></tr>
                              <tr><td>died</td><td>` +
      (node.get_death_year() || "?") +
      ` in ` +
      (node.data.deathplace || "?") +
      `</td></tr>
                      </table>
                      `;
    return content.replace(new RegExp("null", "g"), "?");
  }

  tooltip(tooltip_func) {
    // setter for tooltips
    if (!tooltip_func) {
      this.show_tooltips = false;
    } else {
      this.show_tooltips = true;
      this._tooltip_func = tooltip_func;
    }
    return this;
  }

  static default_node_label_func(node) {
    // node label function
    // text will be split into multiple lines where `label_delimiter` is used
    if (node.is_union()) return;
    return (
      node.get_name() +
      FTDrawer.label_delimiter +
      (node.get_birth_year() || "?") +
      " - " +
      (node.get_death_year() || "?")
    );
  }

  node_label(node_label_func) {
    // setter for node labels
    if (!node_label_func) {
    } else {
      this.node_label_func = node_label_func;
    }
    return this;
  }

  static default_node_class_func(node) {
    // returns a node's css classes as a string
    if (node.is_union()) return;
    else {
      let baseClass = "person";
      let extendableClass = node.is_extendable()
        ? "extendable"
        : "non-extendable";
      let genderClass = node.data.gender === "M" ? "male" : "female";
      return `${baseClass} ${extendableClass} ${genderClass}`;
    }
  }

  node_class(node_class_func) {
    // setter for node css class function
    if (!node_class_func) {
    } else {
      this.node_class_func = node_class_func;
    }
    return this;
  }

  static default_node_size_func(node) {
    // returns an integer determining the node's size
    if (node.is_union()) return 0;
    else return 10;
  }

  node_size(node_size_func) {
    // setter for node size function
    if (!node_size_func) {
    } else {
      this.node_size_func = node_size_func;
    }
    return this;
  }

  static default_link_path_func(s, d) {
    function vertical_s_bend(s, d) {
      // Creates a diagonal curve fit for vertically oriented trees
      return `M ${s.x} ${s.y}
                  C ${s.x} ${(s.y + d.y) / 2},
                  ${d.x} ${(s.y + d.y) / 2},
                  ${d.x} ${d.y}`;
    }

    function horizontal_s_bend(s, d) {
      // Creates a diagonal curve fit for horizontally oriented trees
      return `M ${s.x} ${s.y}
                  C ${(s.x + d.x) / 2} ${s.y},
                    ${(s.x + d.x) / 2} ${d.y},
                    ${d.x} ${d.y}`;
    }
    return this._orientation == "vertical"
      ? vertical_s_bend(s, d)
      : horizontal_s_bend(s, d);
  }

  link_path(link_path_func) {
    // setter for link path function
    if (!link_path_func) {
    } else {
      this.link_path_func = link_path_func;
    }
    return this;
  }

  static make_unique_link_id(link) {
    return link.id || link.source.id + "_" + link.target.id;
  }

  draw(source = this.ft_datahandler.root) {
    // get visible nodes and links
    const nodes = this.ft_datahandler.dag.descendants(),
      links = this.ft_datahandler.dag.links();

    // assign new x and y positions to all nodes
    this.layout(this.ft_datahandler.dag);

    // switch x and y coordinates if orientation = "horizontal"
    if (this._orientation == "horizontal") {
      var buffer = null;
      nodes.forEach(function (d) {
        buffer = d.x;
        d.x = d.y;
        d.y = buffer;
      });
    }

    // ****************** Nodes section ***************************

    // assign node data
    var node = this.g.selectAll("g.node").data(nodes, (node) => node.id);

    // insert new nodes at the parent's previous position.
    var nodeEnter = node
      .enter()
      .append("g")
      .attr("class", "node")
      .attr(
        "transform",
        (_) => "translate(" + source.x0 + "," + source.y0 + ")"
      )
      .on("click", (_, node) => {
        node.click();
        this.draw(node);
      })
      .attr("visible", true);

    // add tooltip
    if (this.show_tooltips) {
      const tooltip_div = this._tooltip_div,
        tooltip_func = this._tooltip_func;
      nodeEnter
        .on("mouseover", function (event, d) {
          tooltip_div
            .transition()
            .duration(200)
            .style("opacity", 1)
            .transition()
            .style("visibility", undefined);
          tooltip_div.html(tooltip_func(d));
          let height = tooltip_div.node().getBoundingClientRect().height;
          tooltip_div
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - height / 2 + "px");
        })
        .on("mouseout", function (d) {
          tooltip_div
            .transition()
            .duration(500)
            .style("opacity", 0)
            .transition()
            .style("visibility", "hidden");
        });
    }

    // add a circle for each node
    nodeEnter
      .append("rect")
      .attr("class", this.node_class_func)
      .attr("width", 100) // Fixed width for the rectangle
      .attr("height", 50) // Fixed height for the rectangle
      .attr("x", -50) // Center the rectangle
      .attr("y", -25) // Center the rectangle
      .attr("rx", 5) // Rounded corners
      .attr("ry", 5); // Rounded corners

    // add node label
    const this_object = this;
    nodeEnter.each(function (node) {
      if (!node.is_union()) {
        // Add name text directly (no delimiter splitting)
        d3.select(this)
          .append("text")
          .attr("class", "node-label")
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "central")
          .text(node.get_name());
      }
    });

    // UPDATE
    var nodeUpdate = nodeEnter.merge(node);

    // transition node to final coordinates
    nodeUpdate
      .transition()
      .duration(this.transition_duration())
      .attr("transform", (d) => "translate(" + d.x + "," + d.y + ")");

    // update node style
    nodeUpdate
      .select(".node rect")
      .attr("class", this.node_class_func)
      .attr("cursor", "pointer");

    // remove hidden nodes
    var nodeExit = node
      .exit()
      .transition()
      .duration(this.transition_duration())
      .attr("transform", (_) => "translate(" + source.x + "," + source.y + ")")
      .attr("visible", false)
      .remove();

    // animation: shrink hidden nodes
    nodeExit.select("rect").attr("width", 1e-6).attr("height", 1e-6);

    // animation: hide hidden nodes' labels
    nodeExit.select("text").style("fill-opacity", 1e-6);

    // ****************** links section ***************************

    // Update the links...
    var link = this.g
      .selectAll("path." + this.link_css_class)
      .data(links, FTDrawer.make_unique_link_id);

    // Enter any new links at the parent's previous position.
    var linkEnter = link
      .enter()
      .insert("path", "g")
      .attr("class", this.link_css_class)
      .attr("d", (_) => {
        var o = {
          x: source.x0,
          y: source.y0,
        };
        return this.link_path_func(o, o);
      });

    // UPDATE
    var linkUpdate = linkEnter.merge(link);

    // Transition back to the parent element position
    linkUpdate
      .transition()
      .duration(this.transition_duration())
      .attr("d", (d) => this.link_path_func(d.source, d.target));

    // Remove any exiting links
    var linkExit = link
      .exit()
      .transition()
      .duration(this.transition_duration())
      .attr("d", (_) => {
        var o = {
          x: source.x,
          y: source.y,
        };
        return this.link_path_func(o, o);
      })
      .remove();

    // expanding a big subgraph moves the entire dag out of the screen
    // to prevent this, cancel any transformations in y-direction
    this.svg
      .transition()
      .duration(this.transition_duration())
      .call(
        this.zoom.transform,
        d3
          .zoomTransform(this.g.node())
          .translate(-(source.x - source.x0), -(source.y - source.y0))
      );

    // store current node positions for next transition
    nodes.forEach(function (d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  clear() {
    this.g.selectAll("*").remove();
  }
}
