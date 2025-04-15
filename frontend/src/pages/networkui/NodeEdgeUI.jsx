import "./NodeEdgeUI.css"; // Import your CSS file for styling
import React, { useCallback, useRef, useEffect, useState } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  reconnectEdge,
  Handle,
  BaseEdge,
  EdgeLabelRenderer,
  getStraightPath,
  useReactFlow,
  useStoreApi,
  ReactFlowProvider,
} from "@xyflow/react";
import axios from "axios";
import "@xyflow/react/dist/style.css";
import CustomNode from "./CustomNode";
import CustomEdge from "./CustomEdge";

const MIN_DISTANCE = 150;

const nodeTypes = { custom: CustomNode };
const edgeTypes = { straight: CustomEdge };

const Flow = () => {
  const store = useStoreApi();
  const { getInternalNode } = useReactFlow();
  const edgeReconnectSuccessful = useRef(true);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const debounceTimeout = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [editingNode, setEditingNode] = useState();
  const [title, setTitle] = useState("");
  const [file, setFile] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [uniqueId, setUniqueId] = useState(null);
  // Add these new state variables at the top of your component
  const [workspaces, setWorkspaces] = useState([
    { id: "1", name: "Default Workspace", nodes: [], edges: [] },
  ]);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");

  // Log workspaces whenever they change (optional)
  useEffect(() => {
    console.log("Workspaces updated:", workspaces);
  }, [workspaces]);

  //This function sends the current nodes and edges to the backend API.
  // Local workspace management
  const createWorkspace = useCallback(() => {
    if (!newWorkspaceName) return;

    const newWorkspace = {
      id: Date.now().toString(),
      name: newWorkspaceName,
      isSelected: true,
    };

    setWorkspaces((prev) => [
      ...prev.map((ws) => ({ ...ws, isSelected: false })),
      newWorkspace,
    ]);
    setNewWorkspaceName("");
  }, [newWorkspaceName]);

  const selectWorkspace = useCallback(
    (workspaceId) => {
      setWorkspaces((prev) => {
        const updated = prev.map((ws) => ({
          ...ws,
          isSelected: ws.id === workspaceId,
        }));
        const selected = updated.find((ws) => ws.id === workspaceId);
        if (selected) {
          
        }
        return updated;
      });
    },
    []
  );

  const saveToAPI = useCallback(() => {
    const payload = { nodes, edges };

    console.log("debounced nodes", nodes);
    console.log("debounced edges", edges);

    fetch("http://localhost:5000/api/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to save");
        return response.json();
      })
      .then((data) => console.log("Save successful:", data))
      .catch((error) => console.error("Save error:", error));
  }, [nodes, edges]);

  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(saveToAPI, 500);

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [nodes, edges]);

  //This useEffect sets up a debounced call to saveToAPI whenever nodes or edges change.
  // preventing frequent saves during rapid changes (like dragging).
  // It waits for 500ms after the last change before calling saveToAPI.
  useEffect(() => {
    fetch("http://localhost:5000/api/flow")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const fetchedNodes = data.data.nodes.map((node) => ({
            ...node,
            position: { x: node.position_x, y: node.position_y },
          }));
          // const fetchedNodes = data.data.nodes;
          const fetchedEdges = data.data.edges;

          // ✅ Log nodes and edges
          console.log("Fetched Nodes:", JSON.stringify(fetchedNodes, null, 2));
          console.log("Fetched Edges:", JSON.stringify(fetchedEdges, null, 2));

          setNodes(fetchedNodes);
          setEdges(fetchedEdges);
          console.log(
            "fer",
            fetchedNodes.map((node) => node.id)
          );
        }
      })
      .catch((error) => console.error("Error fetching flow data:", error));
  }, []);

  //Gets the current state of all nodes from the store.
  //Iterates over all other nodes to find the closest one within a specified minimum distance.
  //Calculate the straight-line (Euclidean) distance between two nodes using Pythagoras theorem.
  const getClosestEdge = useCallback(
    (node) => {
      const { nodeLookup } = store.getState();
      const internalNode = getInternalNode(node.id);

      // Log nodeLookup and internalNode
      console.log("nodeLookup contents:", Array.from(nodeLookup.entries()));
      console.log("internalNode:", internalNode);
      console.log("current node (parameter):", node);

      const closestNode = Array.from(nodeLookup.values()).reduce(
        (res, n) => {
          if (n.id === internalNode.id) return res;
          const dx =
            n.internals.positionAbsolute.x -
            internalNode.internals.positionAbsolute.x;
          const dy =
            n.internals.positionAbsolute.y -
            internalNode.internals.positionAbsolute.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          return d < res.distance && d < MIN_DISTANCE
            ? { distance: d, node: n }
            : res;
        },
        { distance: Number.MAX_VALUE, node: null }
      );

      if (!closestNode.node) return null;

      const closeNodeIsSource =
        closestNode.node.internals.positionAbsolute.x <
        internalNode.internals.positionAbsolute.x;
      return {
        id: `${closestNode.node.id}-${node.id}-temp`,
        source: closeNodeIsSource ? closestNode.node.id : node.id,
        target: closeNodeIsSource ? node.id : closestNode.node.id,
        type: "straight",
        className: "temp",
        style: { strokeDasharray: "5,5" },
      };
    },
    [store, getInternalNode]
  );

  const onNodeDrag = useCallback(
    (_, node) => {
      const closeEdge = getClosestEdge(node);
      setEdges((es) => {
        const nextEdges = es.filter((e) => e.className !== "temp");
        if (
          closeEdge &&
          !nextEdges.find(
            (ne) =>
              ne.source === closeEdge.source && ne.target === closeEdge.target
          )
        ) {
          nextEdges.push(closeEdge);
        }
        return nextEdges;
      });
    },
    [getClosestEdge, setEdges]
  );

  const onNodeDragStop = useCallback(
    (_, node) => {
      const closeEdge = getClosestEdge(node);
      setEdges((es) => {
        const nextEdges = es.filter((e) => e.className !== "temp");
        if (closeEdge)
          nextEdges.push({
            ...closeEdge,
            id: `${closeEdge.source}-${closeEdge.target}`,
            className: undefined,
          });
        return nextEdges;
      });
    },
    [getClosestEdge]
  );

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge({ ...params, type: "straight", animated: true }, eds)
      ),
    [setEdges]
  );

  const onReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false;
  }, []);

  const onReconnect = useCallback((oldEdge, newConnection) => {
    edgeReconnectSuccessful.current = true;
    setEdges((eds) => reconnectEdge(oldEdge, newConnection, eds));
  }, []);

  const onReconnectEnd = useCallback((_, edge) => {
    if (!edgeReconnectSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }
    edgeReconnectSuccessful.current = true;
  }, []);

  const onEdgesDelete = useCallback((edgesToDelete) => {
    setEdges((eds) => eds.filter((edge) => !edgesToDelete.includes(edge)));
  }, []);

  const addNode = () => {
    setIsCreating(true);
  };

  const generateUniqueId = () => {
    const min = 10000; // Smallest 5-digit number
    const max = 99999; // Largest 5-digit number
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  //Update a node with the unique ID after a delay or external process
  const updateNodeOutsideSubmit = async (passedUniqueId) => {
    if (!passedUniqueId) {
      console.error("Unique ID not available yet");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/nodes",
        { uniqueId: String(passedUniqueId) },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Node updated with unique ID:", passedUniqueId);
    } catch (error) {
      console.error("Error updating node outside submit:", error);
    }
  };

  // Handles the PDF submission
  const submitImage = useCallback(
    async (e) => {
      e.preventDefault();
      if ((!isCreating && !editingNode) || !title || !file) return;

      try {
        let generatedUniqueId;
        if (isCreating) {
          generatedUniqueId = generateUniqueId();
          setUniqueId(generatedUniqueId); // Optional if you want to use it elsewhere
        }

        // 1. Save nodes/edges
        let saveSuccess = false;
        try {
          const saveResponse = await fetch("http://localhost:5000/api/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nodes, edges }),
          });
          if (saveResponse.ok) saveSuccess = true;
          else console.error("Save failed:", saveResponse.statusText);
        } catch (saveError) {
          console.error("Save error:", saveError);
        }

        // 2. Upload file
        let uploadResponse = null;
        try {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("title", title);
          formData.append("uniqueId", generatedUniqueId);

          uploadResponse = await axios.post(
            "http://localhost:5000/api/upload",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
        } catch (uploadError) {
          console.error("Upload error:", uploadError);
        }

        // 4. Update UI
        if (isCreating) {
          const newNode = {
            id: `${nodes.length + 1}`,
            type: "custom",
            position: { x: Math.random() * 500, y: Math.random() * 500 },
            data: {
              label: title,
              pdfTitle: title,
              pdfUrl: uploadResponse?.data?.fileUrl || "", // fallback if upload fails
              uniqueId: generatedUniqueId,
            },
            ref: generatedUniqueId,
          };
          setNodes((nds) => [...nds, newNode]);
        } else {
          setNodes((nds) =>
            nds.map((node) =>
              node.id === editingNode.id
                ? {
                    ...node,
                    data: {
                      ...node.data,
                      pdfTitle: title,
                      pdfUrl: uploadResponse?.data?.fileUrl || node.data.pdfUrl,
                    },
                  }
                : node
            )
          );
        }

        // Reset form state
        setIsCreating(false);
        setEditingNode(null);
        setTitle("");
        setFile(null);

        // Optional delay before second update
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await updateNodeOutsideSubmit(generatedUniqueId);
      } catch (error) {
        console.error("Unexpected error:", error);
        alert("An error occurred. Check the console for details.");
      }
    },
    [isCreating, editingNode, nodes, edges, title, file, setNodes]
  );

  const closeForm = useCallback(() => {
    setIsCreating(false);
    setEditingNode(null);
    setTitle("");
    setFile(null);
  }, []);

  // Function to handle node selection
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  // Function to delete the selected node
  const deleteNode = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
      setEdges((eds) =>
        eds.filter(
          (edge) =>
            edge.source !== selectedNode.id && edge.target !== selectedNode.id
        )
      );
      setSelectedNode(null); // Clear the selected node after deletion
    }
  }, [selectedNode, setNodes, setEdges]);

  // Function to delete all nodes and edges
  const handleDeleteAllNodes = useCallback(() => {
    if (window.confirm("Are you sure you want to delete all nodes?")) {
      setNodes([]);
      setEdges([]);
      setSelectedNode(null);
    }
  }, [setNodes, setEdges]);

  const showPdf = useCallback((filename) => {
    window.open(
      `http://localhost:5000/files/${filename}`,
      "_blank",
      "noreferrer"
    );
  }, []);

  // Define the double-click handler function
  const handleNodeDoubleClick = useCallback(
    (event, node) => {
      console.log("Node double-clicked:", node);
      console.log("PDF Title:", node.data.pdfTitle);

      // Open the PDF when node is double-clicked
      if (node.filename) {
        showPdf(node.filename);
      }
    },
    [showPdf]
  ); // Add showPdf to dependencies

  // Function to rename the selected node
  const handleRenameNode = useCallback(() => {
    if (!selectedNode) return;

    const newLabel = prompt("Enter new node name", selectedNode.data.label);
    if (newLabel !== null) {
      setNodes(
        nodes.map((node) =>
          node.id === selectedNode.id
            ? { ...node, data: { ...node.data, label: newLabel } }
            : node
        )
      );
    }
  }, [selectedNode, nodes, setNodes]);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgesDelete={onEdgesDelete}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onReconnect={onReconnect}
        onReconnectStart={onReconnectStart}
        onReconnectEnd={onReconnectEnd}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        onNodeDoubleClick={handleNodeDoubleClick} // Add the double-click handler
        onNodeClick={onNodeClick} // Add the click handler
        fitView
      >
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
      {(isCreating || editingNode) && (
        <div className="form-modal">
          <form onSubmit={submitImage} className="form">
            <h4>
              {isCreating
                ? "Upload PDF for New Node"
                : `Upload PDF for ${editingNode?.data?.label || ""}`}
            </h4>
            <input
              type="text"
              placeholder="Document Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="form-input"
            />
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
              required
              className="file-input"
            />
            <div className="button-group">
              <button
                type="button"
                onClick={closeForm}
                className="btn btn-cancel"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-upload">
                Upload
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="controls-container">
        <button onClick={addNode} className="control-btn btn-primary">
          Add Node
        </button>
        <button
          onClick={deleteNode}
          disabled={!selectedNode}
          className="control-btn btn-danger"
        >
          Delete Node
        </button>
        <button
          onClick={handleDeleteAllNodes}
          disabled={nodes.length === 0}
          className="control-btn btn-warning"
        >
          Delete All Nodes
        </button>
        <button
          onClick={handleRenameNode}
          disabled={!selectedNode}
          className="control-btn btn-success"
        >
          Rename Node
        </button>
      </div>
      {/* Workspace Directory Panel */}
      <div className="workspace-panel">
        <div className="workspace-header">
          <input
            type="text"
            placeholder="New Workspace"
            value={newWorkspaceName}
            onChange={(e) => setNewWorkspaceName(e.target.value)}
            className="workspace-input"
          />
          <button onClick={createWorkspace} className="btn-create-workspace">
            Create
          </button>
        </div>

        <div className="workspace-list">
          {workspaces.map((workspace) => (
            <div
              key={workspace.id}
              className={`workspace-item ${
                workspace.isSelected ? "selected" : ""
              }`}
              onClick={() => selectWorkspace(workspace.id)}
            >
              <div className="workspace-name">{workspace.name}</div>
              <div className="workspace-meta">
                <span>Nodes: {workspace.nodes.length}</span>
                <span>Edges: {workspace.edges.length}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <Flow />
  </ReactFlowProvider>
);
