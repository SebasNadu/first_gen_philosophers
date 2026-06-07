# include <unistd.h>
// # include <stdlib.h>
# include <stdarg.h>
// # include <limits.h>

static int	ft_next_percent(const char *format, va_list args, int i);

int	ft_found_c(int c, int i)
{
	i++;
	write(1, &c, 1);
	return (i);
}

int	ft_found_s(char *s, int i)
{
	if (!s)
		i = ft_found_s("(null)", i);
	else
	{
		while (*s)
		{
			write(1, &(*s), 1);
			s++;
			i++;
		}
	}
	return (i);
}

int	ft_to_hex(size_t hex, int i)
{
	if (hex == 0)
		i = ft_found_c('0', i);
	else if (hex >= 16)
	{
		i = ft_to_hex(hex / 16, i);
		i = ft_to_hex(hex % 16, i);
	}
	else
	{
		if (hex <= 9)
			i = ft_found_c(hex + '0', i);
		else
			i = ft_found_c(hex - 10 + 'a', i);
	}
	return (i);
}

int	ft_found_i_plus_d(int d, int i)
{
	if (d == -2147483648)
	{
		write (1, "-2147483648", 11);
		i = i + 11;
	}
	else if (d >= 0 && d < 10)
		i = ft_found_c(d + '0', i);
	else if (d < 0)
	{
		i = ft_found_c('-', i);
		i = ft_found_i_plus_d(-d, i);
	}
	else
	{
		i = ft_found_i_plus_d(d / 10, i);
		i = ft_found_c(d % 10 + '0', i);
	}
	return (i);
}


int	ft_found_p(size_t p, int i)
{
	if (p)
	{
		i = ft_found_c('0', i);
		i = ft_found_c('x', i);
		i = ft_to_hex(p, i);
	}
	else
		i = ft_found_s("(nil)", i);
	return (i);
}


int	ft_found_u(unsigned int u, int i)
{
	if (u < 10)
		i = ft_found_c(u + '0', i);
	else if (u >= 10)
	{
		i = ft_found_u(u / 10, i);
		i = ft_found_c(u % 10 + '0', i);
	}
	return (i);
}

int	ft_found_x(size_t x, int i)
{
	unsigned int	u;

	u = (unsigned int)x;
	if (u == 0)
		i = ft_found_c('0', i);
	else if (u >= 16)
	{
		i = ft_found_x(u / 16, i);
		i = ft_found_x(u % 16, i);
	}
	else
	{
		if (u <= 9)
			i = ft_found_c(u + '0', i);
		else
			i = ft_found_c(u - 10 + 'a', i);
	}
	return (i);
}

int	ft_found_bigx(size_t bigx, int i)
{
	unsigned int	u;

	u = (unsigned int)bigx;
	if (u == 0)
		i = ft_found_c('0', i);
	else if (u >= 16)
	{
		i = ft_found_bigx(u / 16, i);
		i = ft_found_bigx(u % 16, i);
	}
	else
	{
		if (bigx <= 9)
			i = ft_found_c(u + '0', i);
		else
			i = ft_found_c(u - 10 + 'A', i);
	}
	return (i);
}


int	ft_printf(const char *format, ...)
{
    va_list args;
    int     i;
    int     j;

	i = 0;
	j = 0;
    va_start(args, format);
    while (format[j])
	{
		if (format[j] == '%')
			i = ft_next_percent(format, args, i);
		else if (i >= 0)
			i = ft_found_c(format[j], i);
		if (i < 0)
			return (i);
		j++;
	}
	va_end(args);
	return (i);
}

static int	ft_next_percent(const char *format, va_list args, int i)
{
	if (*format == 'c')
		i = ft_found_c(va_arg(args, int), i);
	else if (*format == 's')
		i = ft_found_s(va_arg(args, char *), i);
	else if (*format == 'p')
		i = ft_found_p(va_arg(args, size_t), i);
	else if (*format == 'd' || *format == 'i')
		i = ft_found_i_plus_d(va_arg(args, int), i);
	else if (*format == 'u')
		i = ft_found_u(va_arg(args, unsigned int), i);
	else if (*format == 'x')
		i = ft_found_x(va_arg(args, size_t), i);
	else if (*format == 'X')
		i = ft_found_bigx(va_arg(args, size_t), i);
	else if (*format == '%')
		i = ft_found_c('%', i);
	else
		i = -1;
	return (i);
}

int main(void)
{
    ft_printf("hi");
    return (0);
}