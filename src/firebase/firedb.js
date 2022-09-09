
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "./config";

async function addItem(collectionName, item) {
    if (!item.domain) {
        alert('domain field is required to add item for ownership lookup')
        return
    }
    /*
    @param collection: db collection of interest, ex: users
    @param item: object to add
    */

    //   const docRef = await addDoc(collection(db, collectionName), {
    //     first: "Alan",
    //     middle: "Mathison",
    //     last: "Turing",
    //     born: 1912
    //   });

    const docRef  = await addDoc(collection(db, collectionName), item)
    console.log(`Document written to collection ${collection} with ID: ${docRef.id}`);
}

export const getItemsWithOrgDomainFilter = async (collectionName, domain) => {

    const q = query(collection(db, collectionName), where("domain", "==", domain));
    const querySnapshot = await getDocs(q);

    return querySnapshot.map(doc => doc.data())
}


export const addVideo = async (video) => await addItem('videos', video)
export const addPointOfInterest = async (point) => await addItem('points', point)
export const addNotification = async (notification) => await addItem('notifications', notification)