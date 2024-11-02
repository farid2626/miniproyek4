import React, { Component } from 'react';
import axios from 'axios';

class StudentCrud extends Component {
  state = {
    students: [],
    currentStudent: { id: null, name: '', class: '', address: '' },
    isEditing: false,
  };

  componentDidMount() {
    this.fetchStudents();
  }

  fetchStudents = () => {
    axios
      .get('https://lumoshive-academy-api.vercel.app/students')
      .then((response) => {
        this.setState({ students: response.data });
      })
      .catch((error) => {
        console.error('Error fetching students:', error);
      });
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      currentStudent: { ...this.state.currentStudent, [name]: value },
    });
  };

  addStudent = () => {
    axios
      .post('https://lumoshive-academy-api.vercel.app/students', this.state.currentStudent)
      .then((response) => {
        this.setState({
          students: [...this.state.students, response.data],
          currentStudent: { id: null, name: '', class: '', address: '' },
        });
      })
      .catch((error) => {
        console.error('Error adding student:', error);
      });
  };

  editStudent = (student) => {
    this.setState({
      currentStudent: student,
      isEditing: true,
    });
  };

  updateStudent = () => {
    axios
      .put(`https://lumoshive-academy-api.vercel.app/students${this.state.currentStudent.id}`, this.state.currentStudent)
      .then((response) => {
        const updatedStudents = this.state.students.map((student) =>
          student.id === this.state.currentStudent.id ? response.data : student
        );
        this.setState({
          students: updatedStudents,
          currentStudent: { id: null, name: '', class: '', address: '' },
          isEditing: false,
        });
      })
      .catch((error) => {
        console.error('Error updating student:', error);
      });
  };

  deleteStudent = (id) => {
    axios
      .delete(`https://lumoshive-academy-api.vercel.app/students${id}`)
      .then(() => {
        const filteredStudents = this.state.students.filter((student) => student.id !== id);
        this.setState({ students: filteredStudents });
      })
      .catch((error) => {
        console.error('Error deleting student:', error);
      });
  };

  render() {
    return (
      <div style={{ margin: '20px' }}>
        <h2>Data Siswa</h2>

        <button
          onClick={() => this.setState({ currentStudent: { id: null, name: '', class: '', address: '' }, isEditing: false })}
          style={{ backgroundColor: 'green', color: 'white', padding: '10px', marginBottom: '10px', border: 'none', borderRadius: '5px' }}
        >
          Tambah
        </button>

        <form onSubmit={(e) => e.preventDefault()} style={{ marginBottom: '20px' }}>
          <input
            type="text"
            name="name"
            placeholder="Nama"
            value={this.state.currentStudent.name}
            onChange={this.handleInputChange}
            required
            style={{ marginRight: '10px' }}
          />
          <input
            type="text"
            name="class"
            placeholder="Kelas"
            value={this.state.currentStudent.class}
            onChange={this.handleInputChange}
            required
            style={{ marginRight: '10px' }}
          />
          <input
            type="text"
            name="address"
            placeholder="Alamat"
            value={this.state.currentStudent.address}
            onChange={this.handleInputChange}
            required
            style={{ marginRight: '10px' }}
          />
          <button
            onClick={this.state.isEditing ? this.updateStudent : this.addStudent}
            style={{ backgroundColor: this.state.isEditing ? 'blue' : 'green', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '5px' }}
          >
            {this.state.isEditing ? 'Update' : 'Tambah'}
          </button>
        </form>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Nim</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Nama</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Kelas</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Alamat</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {this.state.students.map((student, index) => (
              <tr key={student.id}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{index + 1}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{student.name}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{student.class}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{student.address}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                  <button
                    onClick={() => this.editStudent(student)}
                    style={{ backgroundColor: 'blue', color: 'white', padding: '5px 10px', marginRight: '5px', border: 'none', borderRadius: '5px' }}
                  >
                    Update
                  </button>
                  <button
                    onClick={() => this.deleteStudent(student.id)}
                    style={{ backgroundColor: 'red', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '5px' }}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default StudentCrud;