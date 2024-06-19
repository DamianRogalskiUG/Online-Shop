'use client'
import { TopComponent } from "./components/TopComponents/TopComponent"
import { DarkModeProvider } from "./contexts/DarkModeContext"
import { SelectedProductProvider } from "./contexts/SelectedProductContext"
import { ProductListProvider } from "./contexts/ProductListContext"
import { MainComponent } from "./components/MainComponents/MainComponent"
import { LoginContextProvider } from "./contexts/LoginContext"
import { SelectedTitleProvider } from "./contexts/SelectedTitleContext"
import { ShoppingCartProvider } from "./contexts/ShoppingCartContext"
import { useSession } from "next-auth/react"
import Head from 'next/head';


export default function Home() {
  const title='Online Shop'
  const { data: session, status } = useSession({ required: true})
  return (
    <>
    <ShoppingCartProvider>
      <LoginContextProvider>
      <SelectedTitleProvider>
      <SelectedProductProvider>
        <ProductListProvider>
          <DarkModeProvider>
          <Head>
            <title>{title}</title>
          </Head>
            <TopComponent />
            <MainComponent />
          </DarkModeProvider>
        </ProductListProvider>
      </SelectedProductProvider>
      </SelectedTitleProvider>
      </LoginContextProvider>
    </ShoppingCartProvider>
    </>
  )
}