import { useState } from "react";

function App() {
  const [task, setTask] = useState("");
  //const [task, setTask] = useState("Stay hydrated");
  const [tasks, setTasks] = useState<string[]>([]);


  /** This function allows to remove the space, empty string, add the tasks*/
  const addTask = () => {
    if (task.trim() === "") return;

    setTasks([...tasks, task]);
    setTask("");
  };

  /** This function deletes the selected or clicked items using index */
  const deleteTask = (indexToDelete: number) => {
   const updatedTasks = tasks.filter(
    (_, index) => index !== indexToDelete
  );
   setTasks(updatedTasks);    
};

  /**This function is used to make update*/
  const editTask = (indexToEdit: number) => {
    setTask(tasks[indexToEdit]);

      const updatedTasks = tasks.filter(
        (_, index) => index !== indexToEdit
  );
  setTasks(updatedTasks);
};
  
  return (
    <div>
      <h1>Task Tracker</h1>

      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter the task"
      />

      {/* <p>You've typed: {task}</p>
      <p>Total characters:{task.length}</p> */}

       <button onClick={addTask} style={{ marginLeft: "10px" }}>
        Add Task
      </button>

      <h3>Task List</h3>

      <ul>
        {tasks.map((item, index) => ( <li key={index}>{item}

          <button onClick={() => editTask(index)}
            style={{marginLeft: '10px'}}
            >
              Edit
          </button>

          <button onClick={() => deleteTask(index)}
        style={{ marginLeft: "10px" }}
      >
        Delete
          </button>

        </li>))}
      </ul>
    </div>
  );
}

export default App;


