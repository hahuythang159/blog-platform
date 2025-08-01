'use client';

import { useState } from 'react';
import { Box, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { SearchBarProps } from '@/app/interfaces/searchBarProps';

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [keyword, setKeyword] = useState('');

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onSearch?.(keyword.trim());
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setKeyword(e.target.value);
    };

    return (
        <Box
            sx={{
                backgroundColor: '#f0f0f0',
                borderRadius: 2,
                px: 1,
                display: 'flex',
                alignItems: 'center',
                maxWidth: 300,
                width: '100%',
            }}
        >
            <SearchIcon />
            <InputBase
                placeholder="Search…"
                sx={{ ml: 1, flex: 1 }}
                value={keyword}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                inputProps={{ 'aria-label': 'search posts' }}
            />
        </Box>
    );
}
