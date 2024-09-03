import { useContext,useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios'
import ReviewContext from "../../contexts/reviewContext";
import { ProgressBar } from "react-bootstrap";
export default function AllReviews(){
    const {bloodbankId}=useParams()
    const {reviews,reviewDispatch}=useContext(ReviewContext)
    console.log('reviews',reviews.reviewsData)
    useEffect(()=>{
        (async()=>{
            try{
                const response=await axios.get(`http://localhost:3080/api/reviews/${bloodbankId}`,{
                    headers:{
                        Authorization:localStorage.getItem('token')
                    }
                })
                console.log(response.data)
                reviewDispatch({type:'LIST_REVIEWS',payload:response.data})
                reviewDispatch({type:'SET_SERVER_ERRORS',payload:[]})
            }catch(err){
                console.log(err)
                reviewDispatch({type:'SET_SERVER_ERRORS',payload:err.response.data.errors})
            }
        })();
    },[])
    const getRatingColor = (ratings) => {
        if (ratings >= 4) return 'success';
        if (ratings >= 2) return 'warning';
        return 'danger';
    };
    return (
        <div className="justify-content-center">
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Rating</th>
                    </tr>
                </thead>
                <tbody>
                    {reviews?.reviewsData.map((review) => {
                        const formattedRating = parseFloat(review.ratings.toFixed(2));
                        return (
                            <tr key={review._id}>
                                <td>{review.name}</td>
                                <td>{review.description}</td>
                                <td>
                                    <ProgressBar 
                                        now={(formattedRating / 5) * 100}
                                        label={`${formattedRating}/5`}
                                        variant={getRatingColor(formattedRating)}
                                    />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}