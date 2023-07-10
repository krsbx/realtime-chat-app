import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
} from '@chakra-ui/react';
import { useChatContext } from 'stream-chat-react';
import { ChannelData } from 'stream-chat';
import { CUIAutoComplete } from 'chakra-ui-autocomplete';
import { DefaultStreamChatGenerics } from 'stream-chat-react/dist/types/types';
import { UseMultipleSelectionStateChange } from 'downshift/typings';
import Form from './Form';
import { getUsers } from '../actions/users';

const CreateChannelModal = ({ isVisible, onClose }: Props) => {
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pickerItems, setPickerItems] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedItems, setSelectedItems] = useState<typeof pickerItems>([]);
  const [value, setValue] = useState<ChannelData<DefaultStreamChatGenerics>>({
    name: '',
    members: [],
  });

  const { client } = useChatContext();

  const createChannel = useCallback(async () => {
    if (!value.members?.length || !value.name) return;

    try {
      setIsSubmitting(true);

      const channel = client.channel('messaging', value);
      await channel.create();

      onClose();
    } finally {
      setIsSubmitting(false);
      setSelectedItems([]);
      onClose();
    }
  }, [client, onClose, value]);

  useEffect(() => {
    if (!isVisible) return;

    void getUsers('limit=all').then(([err, res]) => {
      if (err) {
        setIsFetching(false);
        return;
      }

      const items = _.map(res, (user) => ({
        value: user.uuid,
        label: user.username,
      }));

      setPickerItems(items);
      setIsFetching(false);
    });
  }, [isVisible]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.name;

    setValue((curr) => ({
      ...curr,
      [key]: e.target.value,
    }));
  };

  const onCreateItem = (item: { value: string; label: string }) => {
    setPickerItems((curr) => [...curr, item]);
    setSelectedItems((curr) => [...curr, item]);
  };

  const onSelectedItemsChange = (
    changes: UseMultipleSelectionStateChange<(typeof pickerItems)[number]>
  ) => {
    if (!changes.selectedItems) return;

    const members = changes.selectedItems.map((item) => item.value);

    setSelectedItems(changes.selectedItems);
    setValue((curr) => ({
      ...curr,
      members,
    }));
  };

  return (
    <Modal
      isOpen={isVisible}
      onClose={onClose}
      closeOnOverlayClick={!isSubmitting}
      allowPinchZoom
      isCentered
      closeOnEsc={!isSubmitting}
    >
      <ModalOverlay />
      <ModalContent width={'35%'} transition={'all 0.15s ease-in-out'}>
        <ModalBody p={0}>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void createChannel();
            }}
            p={5}
          >
            <Flex rowGap={5} flexDirection={'column'} width={'100%'}>
              <FormControl isRequired>
                <FormLabel>Channel Name</FormLabel>
                <Input
                  type="text"
                  placeholder="Channel Name"
                  name={'name'}
                  disabled={isSubmitting || isFetching}
                  onChange={onChange}
                />
              </FormControl>
              <CUIAutoComplete
                items={pickerItems}
                label="Members"
                placeholder="Type new member name"
                selectedItems={selectedItems}
                onCreateItem={onCreateItem}
                onSelectedItemsChange={onSelectedItemsChange}
              />
              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={isSubmitting || isFetching}
              >
                Create
              </Button>
            </Flex>
          </Form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

type Props = {
  onClose: () => void;
  isVisible: boolean;
};

export default CreateChannelModal;
