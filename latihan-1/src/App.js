import './App.css';
import ComboBox from './ComboBox';

const App = () => {
  const handleComboBoxChange = (selectedValues) => {
    console.log('Selected values:', selectedValues);
  };

  const options = [
    'Part 1', 
    'Part Part 11', 
    'Part Part Part 2', 
    'Part Part Part Part 33', 
    'Part 1 Part 2 Part 3 Part 4', 
    'Part Part Part Part Part Part Part 12345'
  ];

  return (
    <div className="App">
      <h1>ComboBox Example</h1>
      <ComboBox options={options} onChange={handleComboBoxChange} />
    </div>
  );
};

export default App;
