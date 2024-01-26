import {
    Button,
    Container,
    createStyles,
    Group,
    Paper,
    rem,
    Select,
    SimpleGrid,
    Textarea,
    TextInput,
    Title,
} from '@mantine/core';
import {useForm} from '@mantine/form';

const useStyles = createStyles((theme) => ({
    title: {
        fontSize: rem(34),
        fontWeight: 800,
        color: theme.colors.blue[9],
        [theme.fn.smallerThan('sm')]: {
            fontSize: rem(24),
        },
        '&::after': {
            content: '""',
            display: 'block',
            backgroundColor: theme.fn.primaryColor(),
            width: rem(45),
            height: rem(2),
            marginTop: theme.spacing.sm,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },

    Card: {
        backgroundColor: 'white',
    },
}));

export function GetInTouchSimple() {
    const {classes} = useStyles();
    const form = useForm({
        initialValues: {
            name: '',
            email: '',
            subject: '',
            message: '',
        },
        validate: {
            name: (value) => value.trim().length < 2,
            email: (value) => !/^\S+@\S+$/.test(value),
            subject: (value) => value.trim().length === 0,
        },
    });

    return (
        <form onSubmit={form.onSubmit(() => {
        })}>
            <Title order={2} className={classes.title} ta="center" mt="sm">
                Contact Us
            </Title>

            <Container size={'lg'}>
                <Paper
                    shadow={'lg'}
                    p={'lg'}
                    radius={'lg'}
                    mt="sm"
                    className={classes.Card}
                >
                    <SimpleGrid
                        cols={2}
                        mt="xl"
                        breakpoints={[{maxWidth: 'sm', cols: 1}]}
                    >
                        <TextInput
                            label="Name"
                            placeholder="Your name"
                            name="name"
                            variant="filled"
                            {...form.getInputProps('name')}
                        />
                        <TextInput
                            label="Email"
                            placeholder="Your email"
                            name="email"
                            variant="filled"
                            {...form.getInputProps('email')}
                        />
                    </SimpleGrid>
                    <Select
                        label="Select department"
                        placeholder="Department"
                        mt="md"
                        variant={'filled'}
                        data={[
                            {value: 'by-hq@ivao.aero', label: 'HQ'},
                            {value: 'ng', label: 'ATC Operations'},
                            {value: 'svelte', label: 'Flight Operations'},
                            {value: 'vue', label: 'Training'},
                        ]}
                    />

                    <TextInput
                        label="Subject"
                        placeholder="Subject"
                        mt="md"
                        name="subject"
                        variant="filled"
                        {...form.getInputProps('subject')}
                    />
                    <Textarea
                        mt="md"
                        label="Message"
                        placeholder="Your message"
                        maxRows={10}
                        minRows={5}
                        autosize
                        name="message"
                        variant="filled"
                        {...form.getInputProps('message')}
                    />

                    <Group position="center" mt="xl">
                        <Button type="submit" c={'#fff'}>
                            Send message
                        </Button>
                    </Group>
                </Paper>
            </Container>
        </form>
    );
}
