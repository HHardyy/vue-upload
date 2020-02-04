import axios from 'axios'
const state = {
  todos: [
    {
      id: 1,
      title: 'this is first todos'
    }
  ]
}

const mutations = {
  setTodos (state, todos) {
    state.todos = todos
  },
  addTodos (state, todos) {
    state.todos.unshift(todos)
  },
  delTodos (state, id) {
    console.log(typeof state.todos)
    state.todos = state.todos.filters(item => item.id !== id)
  }
}

const actions = {
  async getTodos ({ commit }) {
    let res = await axios.get('http://jsonplaceholder.typicode.com/todos')
    commit('setTodos', res.data)
  },
  async addStates ({ commit }, todo) {
    let res = await axios.post('http://jsonplaceholder.typicode.com/todos', todo)
    commit('addTodos', res.data)
  },
  async delStates ({ commit }, id) {
    await axios.delete(`http://jsonplaceholder.typicode.com/todos/${id}`)
    commit('delTodos', id)
  }
}

const getters = {
  getAllstate () {
    return state.todos
  }
}

export default { state, mutations, actions, getters }
