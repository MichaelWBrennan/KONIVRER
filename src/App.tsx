import CardSearch from './components/CardSearch'
import DeckSearch from './components/DeckSearch'
import './App.css'

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>KONIVRER Deck Database</h1>
        <p>Professional deck building and card database platform</p>
      </header>
      
      <main className="app-main">
        <CardSearch />
        <DeckSearch />
      </main>
    </div>
  )
}

export default App