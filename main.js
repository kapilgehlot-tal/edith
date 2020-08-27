var express = require("express");
var app = express();
const widgets = [
  {
    node_id: 1,
    type: "static_text",
    value: "Hi there {user_name}",
  },
  {
    node_id: 2,
    type: "selectionComp",
    value: {
      title: "select",
      childStrings: [],
    },
  },

  {
    node_id: 3,
    type: "summary",
    value: "You have selected....",
  },

  {
    node_id: 4,
    type: "interestSummary",
    value: {},
  },
  {
    node_id: 5,
    type: "buttons",
    confirmation_false: {
      type: "button",
      value: "cancel",
    },
    confirmation_true: {
      type: "button",
      value: "continue on",
    },
  },
];

var users = new Map();
var nodes = new Map();
nodes.set(0, [1, 2, 3, 4, 5]); //need to change
nodes.set(1, []);
nodes.set(2, [3, 4]);
nodes.set(3, []);
nodes.set(4, []);
nodes.set(5, []);

app.get("/", function (req, res) {
  res.send("eidth");
});

app.get("/users/:id/active-request", function (req, res) {
  const userId = req.params.id;
  const userData = users.get(userId);

  if (userData && userData.isRequestActive) {
    console.log(userData);
    res.send({ nodeId: userData.nodeId });
  } else {
    res.send(null);
  }
});

app.get("/users/:id/nodes/:nodeId/next-nodes", function (req, res) {
  const userId = req.params.id;
  const nodeId = parseInt(req.params.nodeId);

  let childNodeIds = nodes.get(nodeId);

  users.set(userId, {
    isRequestActive: true,
    nodeId: nodeId,
  });

  res.send(
    childNodeIds.map((nodeId) => {
      return widgets[nodeId - 1];
    }),
  );
});

app.post("/users/:id/action/:type", function (req, res) {
  const userId = req.params.id;
  const actionType = req.params.type;

  if (actionType == "CANCEL") {
    const userData = users.get(userId);
    userData.isRequestActive = false;
    userData.nodeId = 0;
    users.set(userId, userData);
  }

  res.send("success");
});
const PORT = process.env.PORT || 5000;

var server = app.listen(PORT, function () {
  var port = server.address().port;
  console.log("EDITH listening at", port);
});
