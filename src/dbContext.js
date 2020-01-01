import React from 'react'

const DbContext = React.createContext({})
export const DbContextProvider = DbContext.Provider
export const DbContextConsumer = DbContext.Consumer
export default DbContext
