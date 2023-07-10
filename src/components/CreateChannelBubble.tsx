import React, { useState } from 'react';
import { Button } from '@chakra-ui/react';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import CreateChannelModal from './CreateChannelModal';

const CreateChannelBubble = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => setIsModalVisible((curr) => !curr);

  return (
    <React.Fragment>
      <Button
        width={'56px'}
        height={'56px'}
        justifyContent={'center'}
        alignItems={'center'}
        borderRadius={'full'}
        cursor={'pointer'}
        backgroundColor={'transparent'}
        color={'blackAlpha.700'}
        padding={2}
        _hover={{
          color: 'black',
        }}
        transition={'all 0.2s ease-in-out'}
        onClick={toggleModal}
      >
        <AiOutlinePlusCircle size={'2.5rem'} />
      </Button>
      <CreateChannelModal isVisible={isModalVisible} onClose={toggleModal} />
    </React.Fragment>
  );
};

export default CreateChannelBubble;
