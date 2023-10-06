import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import  { Home, NewProject }  from './container';
import { auth, db } from './config/firebase.config';
import { useEffect, useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { Spinner } from './components';
import { useDispatch } from 'react-redux';
import { SET_USER } from './context/actions/userActions';

function App() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(userCred => {
        if(userCred){
          console.log(userCred?.providerData[0]);
          setDoc(doc(db, "users", userCred?.uid), userCred?.providerData[0]).
          then(
            () => {
              // dispatch the action to store
              dispatch(SET_USER(userCred?.providerData[0]));
              navigate("/home/projects", {replace : true});
            }
          );
        }else{
          navigate("/home/auth", {replace : true});
        }

        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
    });

    // clean up the lister event
    return () => unsubscribe();
  }, [])
  
  return (
    <>
      {isLoading ? (
        <div className="w-screen h-screen flex items-center justify-center overflow-hidden">
          <Spinner />
        </div>
      ) : (
        <div
          className="w-screen  h-screen flex items-start justify-start 
        overflow-hidden"
        >
          <Routes>
            <Route path="/home/*" element={<Home />} />
            <Route path="*" element={<Navigate to={"/home"} />} />
            <Route path="/newProject" element={< NewProject/>}
            />
          </Routes>
        </div>
      )}
    </>
  );
}

export default App;
