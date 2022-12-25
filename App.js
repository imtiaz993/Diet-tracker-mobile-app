/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Button, Text} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
const App = () => {
  const SignUp = () => {
    auth()
      .createUserWithEmailAndPassword(
        'imtiazh993@gmail.com',
        'SuperSecretPassword!',
      )
      .then(res => {
        console.log('User account created & signed in!');
        firestore()
          .collection('Users')
          .add({
            userID: res.user.uid,
            email: 'imtiazh993@gmail.com',
            name: 'Imtiaz Hussain',
          })
          .then(res => {
            console.log('User added!');
            console.log(res);
          });
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
  };

  const SignIn = () => {
    auth()
      .signInWithEmailAndPassword(
        'imtiazh993@gmail.com',
        'SuperSecretPassword!',
      )
      .then(() => {
        console.log('User account created & signed in!');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
  };

  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const SignOut = () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  };

  const [diets, setDiets] = useState([]);
  const getDiets = async () => {
    const tempDiets = [];
    await firestore()
      .collection('DietPlans')
      .get()
      .then(querySnapshot => {
        console.log('Total Diets: ', querySnapshot.size);

        querySnapshot.forEach(documentSnapshot => {
          console.log('Diet: ', documentSnapshot.id, documentSnapshot.data());
          tempDiets.push(documentSnapshot.data());
        });
      });
    setDiets([...tempDiets]);
  };
  const selectDiet = item => {
    firestore()
      .collection('SelectedDiet')
      .doc(user.uid)
      .set({
        userID: user.uid,
        diet: item,
      })
      .then(res => {
        console.log('Diet Selected');
        console.log(res);
      });
  };
  const [selected, setSelected] = useState();
  const getSelected = () => {
    firestore()
      .collection('SelectedDiet')
      .doc(user.uid)
      .onSnapshot(documentSnapshot => {
        console.log('Selected: ', documentSnapshot.data());
        setSelected(documentSnapshot.data());
      });
  };

  const getNutrients = async () => {
    setLoading(true);
    const res = await fetch(
      'https://api.edamam.com/api/food-database/v2/parser?app_id=55d3d869&app_key=ed133ed6be42a06ea958e31ed778fad8&ingr=biryani',
    );
    const result = await res.json();
    consolelog(result);
  };

  const [tracker, setTracker] = useState({energy: 0, fat: 0});
  const getTracker = () => {
    firestore()
      .collection('DietTracker')
      .doc(user.uid)
      .onSnapshot(documentSnapshot => {
        console.log('Tracker: ', documentSnapshot.data());
        setTracker(documentSnapshot.data());
      });
  };

  const updateTracker = () => {
    firestore()
      .collection('DietTracker')
      .doc(user.uid)
      .set({
        energy: tracker.energy + 10,
        fat: tracker.fat + 20,
      })
      .then(res => {
        console.log('Tracker Updated');
        console.log(res);
      });
  };

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  }, []);

  if (initializing) return null;
  if (!user) {
    return (
      <View style={styles.container}>
        <TouchableOpacity>
          <Button style={styles.font} onPress={SignUp} title="Register" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Button style={styles.font} onPress={SignIn} title="Login" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.font}>Welcome {user.email}</Text>
      <TouchableOpacity>
        <Button style={styles.font} onPress={getDiets} title="getDiets" />
      </TouchableOpacity>
      <TouchableOpacity>
        <Button style={styles.font} onPress={SignOut} title="signOut" />
      </TouchableOpacity>
      {diets &&
        diets.map((item, index) => (
          <TouchableOpacity key={index}>
            <Button
              style={styles.font}
              onPress={() => {
                selectDiet(item);
              }}
              title={item.Energy + ' ' + item.Fat}
            />
          </TouchableOpacity>
        ))}
      <TouchableOpacity>
        <Button style={styles.font} onPress={getSelected} title="getSelected" />
      </TouchableOpacity>
      {selected && (
        <TouchableOpacity>
          <Button
            style={styles.font}
            onPress={() => {}}
            title={selected.diet.Energy + ' ' + selected.diet.Fat}
          />
        </TouchableOpacity>
      )}
      <TouchableOpacity>
        <Button
          style={styles.font}
          onPress={getNutrients}
          title="getNutrients"
        />
      </TouchableOpacity>
      <TouchableOpacity>
        <Button style={styles.font} onPress={getTracker} title="getTracker" />
      </TouchableOpacity>
      <TouchableOpacity>
        <Button
          style={styles.font}
          onPress={updateTracker}
          title="updateTracker"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgray',
  },
  font: {
    fontSize: 20,
    fontWeight: '700',
  },
});

export default App;
