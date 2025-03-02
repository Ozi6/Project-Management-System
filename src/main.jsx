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
                variables: { colorPrimary: '#9AC8CD' },
                rootBox: {
                    backgroundColor: '#1E0342', 
                    color: '#2D5CF2', 
                    padding: '5px 5px', 
                    borderRadius: '200px', 
                },
                avatarBox: {
                    width: '40px',
                    height: '40px',
                },
                userPreview: {color: '#1E0342',},
                userButtonPopoverActionButtonIcon__manageAccount: {color: '#5C787B',},
                userButtonPopoverActionButton__manageAccount: {color: '#7BA0A4',},
                userButtonPopoverActionButtonIcon__signOut: {color: '#5C787B',},
                userButtonPopoverActionButton__signOut: {color: '#7BA0A4',},
                dividerRow: {color: '#FF9494',},
          },
        },

        signIn: {
          //baseTheme: [undefined],
          variables: { colorPrimary: '#2D5CF2' },
          elements: {
            headerTitle: {color: '#2D5CF2'},
            headerSubtitle: {color: '#1E0342'},
            formFieldLabelRow:{color: '#E57777'},
            socialButtonsBlockButton: {
              backgroundColor : '#FFFFFF',
              color: '#1E0342',
            },
            input: {color: '#0E46A3'},
            footerActionText: {color: '#1E0342'},
            formFieldLabel: {color: '#1E0342'},
            
          },
        },

        signUp: {
          variables: { colorPrimary: '#2D5CF2' },
          elements: {
            input: {color: '#1E0342'},
            socialButtonsBlockButton: {
              backgroundColor : '#FFFFFF',
              color: '#1E0342',
            },
          }
          
        },

        userProfile: {
          variables: { colorPrimary: '#0E46A3' },
          rootBox : {backgroundColor: '#0E46A3'},
          elements: {
            
            profilePage: {color: '#1E0342'},
            profileSectionItem : {color: '#1E0342'},
            userProfile : {color: '#1E0342'},
            profilePage__account : {color: '#1E0342'},
          }
        }
      }}

      publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/"
    >
      <App />
    </ClerkProvider>
  </StrictMode>,
)
