import React from 'react'
import { getAccessToken } from '../../../../common/userInfo'
import { server } from '../../../../server'
import { Toaster, toast } from "react-hot-toast"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const AdminReportMatch = ({ missingReport, foundReport, setOpen }) => {

    let access_token = getAccessToken()
    let navigate = useNavigate()

    const matchReports = async () => {

        console.log("missingReportId",missingReport)
        console.log("foundReportId",foundReport)
        
        const data = {
            found_report_id: foundReport._id,
            partner_missing_report_id: missingReport.id
        }

        console.log(data)

        await axios.put(`${server}/report/match-reports`, data, {
            withCredentials: true,
            headers: {
                'authorization': `Bearer ${access_token}`
            }
        })
        .then(({ data }) => {
            console.log("data",data)
            setOpen(false)
            toast.success("Reports matched successfully, the found item can be claimed by the owner of the missing item")
            setTimeout(() => {
                navigate(`/admin/dash/`)
            })
        }).catch (error => {
            console.error(error)
        })
    }

    return (
        <div>
            <Toaster/>
            <div className="flex flex-col justify-center items-center mt-10 gap-10 mb-10">
                                    
                <p className="text-center">
                    {`Are you sure you want to match found item report no. ${foundReport.report_info.report_id} and missing item report no. ${missingReport.report_id}?`}
                </p>

                <div>
                    <button
                        onClick={() => setOpen(false)}
                        className="bg-red-500 text-white font-bold py-2 px-4 rounded mr-2"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            // setOpen(false)
                            matchReports()
                        }}
                        className="bg-green-500 text-white font-bold py-2 px-4 rounded"
                    >
                        Match
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AdminReportMatch