export interface AppProps {
  greetings: string;
}

export const App = ({ greetings }: AppProps) => {
  return (
    <h1>{greetings}</h1>
  )
};

export default App;