import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { Flex, IconButton } from '@chakra-ui/react';
import { MouseEventHandler } from 'react';
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql';

type TUpdootSectionProps = {
  post: PostSnippetFragment;
};

enum EVote {
  UP = 'up',
  DOWN = 'down',
}

export const UpdootSection = ({ post }: TUpdootSectionProps) => {
  const [, vote] = useVoteMutation();

  const onVoteClick =
    (voteParam: EVote): MouseEventHandler<HTMLButtonElement> =>
    async (): Promise<void> => {
      if (voteParam === EVote.UP) {
        await vote({ postId: post.id, value: 1 });
      } else {
        await vote({ postId: post.id, value: -1 });
      }
    };

  return (
    <Flex direction='column' justifyContent='center' alignItems='center' mr={4}>
      <IconButton
        onClick={onVoteClick(EVote.UP)}
        aria-label='Upvote post'
        variantColor='green'
        icon={<ChevronUpIcon />}
      />
      {post.points}
      <IconButton
        onClick={onVoteClick(EVote.DOWN)}
        aria-label='Downvote post'
        variantColor='red'
        icon={<ChevronDownIcon />}
      />
    </Flex>
  );
};
