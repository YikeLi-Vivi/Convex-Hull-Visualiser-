import * as React from 'react';
import Box from '@mui/material/Box';
import Button from './Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import styled from 'styled-components';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const HelpButton = styled.button `
    width: 50px;
    height: 50px;
    background-color: black;
    border-radius: 50%;
    font-size: 20px;
    text-align:center;
    color:white;
    margin-bottom:20px;
`



export interface ModalProp {
    openFun(): void;
    closeFun():void;
}
export default function PopUpBox(props: ModalProp) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {setOpen(true); props.openFun};
  const handleClose = () => {setOpen(false); props.closeFun};

  return (
    <div>
      <HelpButton onClick={handleOpen}> ? </HelpButton>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Following the steps to use the visualizer
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <div>1. Add points to the screen through mouse clicking </div>
            <div>2. Select algorithm</div>
            <div>3. Click "Solve" button</div>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}