import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button,
} from '@mui/material';

const CustomizePreviewModal = ({ isOpen, data, onClose, onSubmit, submival }) => {
    if (!isOpen) return null;
    const mobileNumbers = data.isInitialState?.split('\n').map(num => num.trim()).slice(0, 5) || [];
    const messageLength = data.message?.length || 0;

    const getMediaPreview = () => {
        const { imageFile, pdfFile, videoFile } = data;

        if (imageFile) {
            return (
                <img
                    src={URL.createObjectURL(imageFile)}
                    alt="Image Preview"
                    style={{ width: '50px', height: '50px' }}
                />
            );
        } else if (pdfFile) {
            return (
                <embed
                    src={URL.createObjectURL(pdfFile)}
                    type="application/pdf"
                    width="50"
                    height="50"
                    style={{ objectFit: 'cover' }}
                />
            );
        } else if (videoFile) {
            return (
                <video width="50" height="50" controls>
                    <source src={URL.createObjectURL(videoFile)} type={videoFile.type} />
                    Your browser does not support the video tag.
                </video>
            );
        }
        return "None";
    };

    return (
        <Dialog open={isOpen} onClose={onClose}>
            <DialogTitle className='modal_table_header'>SMS Preview</DialogTitle>
            <DialogContent className='GiriAddCampaignModal'>
                <div className="table-container">
                    <Table className='table_modal'>
                        <TableHead className='sticky_thead'>
                            <TableRow>
                                <TableCell><strong>Mobile</strong></TableCell>
                                <TableCell><strong>Message</strong></TableCell>
                                <TableCell><strong>Length</strong></TableCell>
                                <TableCell><strong>Media</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mobileNumbers.map((number, index) => (
                                <TableRow key={index}>
                                    <TableCell>{number}</TableCell>
                                    <TableCell>
                                        <textarea
                                            className="textarea_modal_view"
                                            value={data.message}
                                            readOnly
                                        />
                                    </TableCell>
                                    <TableCell>{messageLength}</TableCell>
                                    <TableCell>{getMediaPreview()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className='modal_tcontact'>Total Contacts: <strong>{data.contactCount}</strong></div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} className='modal_cbtn'>Cancel</Button>
                <Button onClick={onSubmit} disabled={submival} className='modal_sbtn'>Submit</Button>
            </DialogActions>
        </Dialog>
    );
};

export default CustomizePreviewModal;
