import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/clerk-react'
import { dark, neobrutalism, shadesOfPurple } from '@clerk/themes'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider 
      appearance={{

        userButton:{
            elements: {
                variables: { colorPrimary: '#FF9494' },
                rootBox: {
                    backgroundColor: '#FFE3E1', // Set background color if needed
                    color: '#E57777', // Set the text color (for UserButton label)
                    padding: '5px 5px', // Optional: add some padding
                    borderRadius: '200px', // Optional: rounded corners
                },
                avatarBox: {
                    width: '40px',
                    height: '40px',
                },
                userPreview: {color: '#FF9494',},
                userButtonPopoverActionButtonIcon__manageAccount: {color: '#C06666',},
                userButtonPopoverActionButton__manageAccount: {color: '#FF9494',},
                userButtonPopoverActionButtonIcon__signOut: {color: '#C06666',},
                userButtonPopoverActionButton__signOut: {color: '#FF9494',},
                dividerRow: {color: '#FF9494',},
          },
        },

        signIn: {
          //baseTheme: [undefined],
          variables: { colorPrimary: '#FF9494' },
          elements: {
            headerTitle: {color: '#FF9494'},
            headerSubtitle: {color: '#CC7676'},
            formFieldLabelRow:{color: '#E57777'},
            socialButtonsBlockButton: {
              backgroundColor : '#FFF8FC',
              color: '#D27979',
            },
            input: {color: '#D27979'},
            footerActionText: {color: '#CC7676'},
            formFieldLabel: {color: '#CC7676'},
            
          },
        },

        signUp: {
          variables: { colorPrimary: '#FF9494' },
          elements: {
            input: {color: '#D27979'},
          }
        },

        userProfile: {
          variables: { colorPrimary: '#FF9494' },
          rootBox : {backgroundColor: '#A35E5E'},
          elements: {
            
            profilePage: {color: '#A35E5E'},
            profileSectionItem : {color: '#A35E5E'},
            userProfile : {color: '#A35E5E'},
            profilePage__account : {color: '#A35E5E'},
          }
        }
      }}

      publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/"
    >
      <App />
    </ClerkProvider>
  </StrictMode>,
)
