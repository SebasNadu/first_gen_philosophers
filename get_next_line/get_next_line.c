#include "get_next_line.h"

char	*get_next_line(int	fd)
{
	int		i;
	int		byte;
	char	*str;
	char	c;

	if (fd < 0 || BUFFER_SIZE < 1)
		return (NULL);
	i = 0;
	str = (char *)malloc(7000000);
	if (!str)
		return (NULL);
	byte = read(fd, &c, 1);
	while (byte > 0)
	{
		str[i] = c;
		i++;
		if (c == '\n' || c == EOF)
			break ;
		byte = read(fd, &c, 1);
	}
	// no more char OR error => return NULL
	if (i == 0 || byte < 0)
	{
		free(str);
		return (NULL);
	}
	//if the subject says return NULL when error happens
	// if (byte < 0)
	// 	return (free(str), NULL); 
	str[i] = '\0';
	return (str);
}

int	main(void)
{
	int		i;
	int		fd;
	char	*str;
	char	*path;

	path = "test.txt";
	fd = open(path, O_RDONLY);
	i = 0;
	while (i < 6) // <-- number of loops
	{
		i++;
		str = get_next_line(fd);
		printf("%d. %s", i, str);
		free(str);
	}
	// printf("%i\n", INT32_MIN);
	// printf("%i\n", -2147483648);
	close(fd);
	return (0);
}