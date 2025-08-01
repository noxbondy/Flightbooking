import { DefineConfig } from 'vite'
import react from '@vitejs/plugin-react'



// https://vitejs.dev/config/
export default DefineConfig({
  plugins: [react()],
  base: "/FlightBooking-react/"
})

