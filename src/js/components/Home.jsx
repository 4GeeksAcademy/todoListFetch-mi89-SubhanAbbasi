import React, { useEffect, useState } from "react";
import "../../styles/index.css";

const Home = () => {
	const username = "subhan";
	const userUrl = `https://playground.4geeks.com/todo/users/${username}`;
	const addTodoUrl = `https://playground.4geeks.com/todo/todos/${username}`;

	const [task, setTask] = useState("");
	const [todos, setTodos] = useState([]);

	const createUser = async () => {
		try {
			await fetch(userUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				}
			});
		} catch (error) {
			console.log(error);
		}
	};

	const getTodos = async () => {
		try {
			const response = await fetch(userUrl);

			if (response.status === 404) {
				await createUser();
				return;
			}

			const data = await response.json();
			setTodos(data.todos || []);
		} catch (error) {
			console.log(error);
		}
	};

	const addTask = async (e) => {
		if (e.key === "Enter" && task.trim() !== "") {
			try {
				await fetch(addTodoUrl, {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						label: task,
						is_done: false
					})
				});

				setTask("");
				await getTodos();
			} catch (error) {
				console.log(error);
			}
		}
	};

	const deleteTask = async (id) => {
		try {
			await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
				method: "DELETE"
			});
			await getTodos();
		} catch (error) {
			console.log(error);
		}
	};

	const clearAllTasks = async () => {
		try {
			for (const todo of todos) {
				await fetch(`https://playground.4geeks.com/todo/todos/${todo.id}`, {
					method: "DELETE"
				});
			}
			await getTodos();
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		// ALWAYS try to create user first
		createUser().then(() => getTodos());
	}, []);

	return (
		<div className="todo-wrapper">
			<h1>todos</h1>

			<div className="todo-container">
				<input
					type="text"
					placeholder="What needs to be done?"
					value={task}
					onChange={(e) => setTask(e.target.value)}
					onKeyDown={addTask}
				/>

				{todos.length === 0 ? (
					<li className="empty">No tasks, add a task</li>
				) : (
					todos.map((item) => (
						<li key={item.id} className="todo-item">
							<span>{item.label}</span>
							<span
								className="delete-btn"
								onClick={() => deleteTask(item.id)}>
								x
							</span>
						</li>
					))
				)}

				<div className="footer">{todos.length} item left</div>

				<button className="clear-btn" onClick={clearAllTasks}>
					Clear all tasks
				</button>
			</div>
		</div>
	);
};

export default Home;