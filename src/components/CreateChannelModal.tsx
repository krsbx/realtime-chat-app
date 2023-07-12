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
import useAuth from '../hooks/useAuth';

const CreateChannelModal = ({ isVisible, onClose }: Props) => {
  const [isFetching, setIsFetching] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
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
    if (!value.members?.length || value.members.length < 1) return;

    try {
      setIsSubmitting(true);

      const channel = client.channel('messaging', {
        ..._(value).pickBy(_.identity).value(),
        members: [...value.members, user.uuid],
      });
      await channel.create();
    } finally {
      setIsSubmitting(false);
      setSelectedItems([]);
      onClose();
    }
  }, [client, onClose, user.uuid, value]);

  useEffect(() => {
    if (!isVisible) return;

    const queries = _.compact([
      'limit=all',
      user?.uuid && `filters=uuid != "${user.uuid}"`,
    ]);

    void getUsers(queries.join('&')).then(([err, res]) => {
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
  }, [isVisible, user.uuid]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const key = e.target.name;

    setValue((curr) => ({
      ...curr,
      [key]: e.target.value,
    }));
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
              <FormControl>
                <FormLabel>Channel Name</FormLabel>
                <Input
                  type="text"
                  placeholder="Channel Name"
                  name={'name'}
                  disabled={isSubmitting || isFetching}
                  value={value.name}
                  onChange={onChange}
                />
              </FormControl>
              <CUIAutoComplete
                items={pickerItems}
                label="Members"
                placeholder="Type new member name"
                selectedItems={selectedItems}
                onSelectedItemsChange={onSelectedItemsChange}
                disableCreateItem
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
